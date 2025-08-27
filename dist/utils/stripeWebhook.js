"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
exports.stripeWebhook = stripeWebhook;
const stripe_1 = __importDefault(require("stripe"));
const payment_model_1 = require("../app/modules/payment/payment.model");
const memberShip_model_1 = require("../app/modules/memberShip/memberShip.model");
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18", // use a valid Stripe API version
});
function stripeWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = exports.stripe.webhooks.constructEvent(req.body, // ⚠ raw body required
            sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.error("❌ Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object;
                    const subscriptionId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.subscriptionId;
                    if (!subscriptionId)
                        break;
                    const sub = yield payment_model_1.Subscription.findById(subscriptionId);
                    if (!sub)
                        break;
                    const membership = yield memberShip_model_1.MemberShip.findById(sub.membershipId);
                    if (!membership)
                        break;
                    const now = new Date();
                    const endDate = new Date(now);
                    // ✅ Calculate end date
                    if (membership.type === "recurring") {
                        switch (membership.interval) {
                            case "day":
                                endDate.setDate(endDate.getDate() + 1);
                                break;
                            case "week":
                                endDate.setDate(endDate.getDate() + 7);
                                break;
                            case "month":
                                endDate.setMonth(endDate.getMonth() + 1);
                                break;
                            case "year":
                                endDate.setFullYear(endDate.getFullYear() + 1);
                                break;
                            default:
                                endDate.setDate(endDate.getDate() + 7); // fallback weekly
                        }
                    }
                    else {
                        // One-time plan
                        endDate.setMonth(endDate.getMonth() + (membership.durationInMonths || 1));
                    }
                    // ✅ Update subscription in DB
                    sub.status = "active";
                    sub.startDate = now;
                    sub.endDate = endDate;
                    if (membership.signUpFee > 0)
                        sub.signUpFeePaid = true;
                    if (membership.refundableDeposit > 0)
                        sub.refundableDepositPaid = true;
                    yield sub.save();
                    console.log("✅ Subscription activated:", sub._id);
                    // 🔹 Send completed invoice for one-time payments
                    if (membership.type === "onetime" && session.customer) {
                        try {
                            const totalAmount = membership.price +
                                (membership.signUpFee || 0) +
                                (membership.refundableDeposit || 0);
                            // Create invoice item
                            yield exports.stripe.invoiceItems.create({
                                customer: session.customer,
                                amount: totalAmount * 100,
                                currency: "usd",
                                description: membership.description,
                            });
                            // Create invoice
                            const invoice = yield exports.stripe.invoices.create({
                                customer: session.customer,
                                collection_method: "send_invoice",
                                days_until_due: 0,
                            });
                            // Only finalize if invoice.id exists
                            if (!invoice.id) {
                                console.error("❌ Invoice ID is undefined, cannot finalize invoice.");
                            }
                            else {
                                yield exports.stripe.invoices.finalizeInvoice(invoice.id);
                                console.log("📄 Invoice sent to customer:", session.customer);
                            }
                        }
                        catch (err) {
                            console.error("❌ Failed to send invoice:", err.message);
                        }
                    }
                    break;
                }
                case "invoice.payment_failed": {
                    const invoice = event.data.object;
                    const subscriptionId = ((_b = invoice.metadata) === null || _b === void 0 ? void 0 : _b.subscriptionId) ||
                        (typeof invoice.subscription === "string" ? invoice.subscription : null);
                    if (subscriptionId) {
                        console.log("⚠️ Payment failed for subscription:", subscriptionId);
                        // Optionally: update subscription status in DB
                        // await Subscription.findByIdAndUpdate(subscriptionId, { status: 'past_due' });
                    }
                    else {
                        console.log("⚠️ Payment failed, but no subscription attached to invoice");
                    }
                    break;
                }
                default:
                    console.log(`ℹ️ Unhandled event type: ${event.type}`);
            }
            res.json({ received: true });
        }
        catch (err) {
            console.error("❌ Webhook handling error:", err.message);
            res.status(500).send("Webhook handling failed");
        }
    });
}
