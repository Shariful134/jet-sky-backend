"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-01-27",
});
// Controller for Stripe Webhook
const webhookController = (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event, 'event geting here');
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                console.log("✅ Checkout completed:", session.id);
                console.log("Customer: ", session);
                if (session.subscription) {
                    console.log("New subscription created:", session.subscription);
                    // TODO: Save subscription ID to your DB with userId (from metadata / client_reference_id)
                }
                break;
            }
            case "customer.subscription.created": {
                const subscription = event.data.object;
                console.log("✅ Subscription created:", subscription.id);
                console.log(subscription, 'subscription');
                // TODO: Save subscription details in DB
                break;
            }
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("✅ PaymentIntent succeeded:", paymentIntent.id);
                break;
            case "payment_intent.payment_failed":
                const failedIntent = event.data.object;
                console.log("❌ Payment failed:", failedIntent.id);
                break;
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                console.log("🔄 Subscription updated:", subscription.id);
                console.log(subscription, 'subscription');
                // TODO: Update subscription status/plan in DB
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                console.log("Subscription canceled:", subscription.id);
                console.log(subscription, 'subscription');
                // TODO: Mark subscription as canceled in DB
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;
                console.log("💰 Payment succeeded:", invoice.id);
                console.log(invoice, 'invoice');
                // TODO: Record payment in DB, update user’s subscription status
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;
                console.log("⚠️ Payment failed:", invoice.id);
                console.log(invoice, 'invoice');
                // TODO: Notify user to update payment method
                break;
            }
            default: {
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
            }
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("❌ Error handling event:", err.message);
        res.status(500).send("Internal server error");
    }
};
exports.webhookController = webhookController;
