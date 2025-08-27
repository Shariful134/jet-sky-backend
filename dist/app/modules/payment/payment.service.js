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
const stripe_1 = __importDefault(require("stripe"));
const memberShip_services_1 = require("../memberShip/memberShip.services");
const payment_model_1 = require("./payment.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-01", // bypass TS check
});
const createCheckoutSessionCtrl = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, memberShipId, }) {
    const memberShip = yield memberShip_services_1.memberShipServices.getSingleMemberShipIntoDB(memberShipId);
    if (!memberShip) {
        return {
            message: "MemberShip not found",
            status: 404,
        };
    }
    // Extract values safely from schema
    const durationMonths = memberShip.durationInMonths || 1;
    const signUpFee = memberShip.signUpFee || 0;
    const refundableDeposit = memberShip.refundableDeposit || 0;
    // 1️⃣ Calculate subscription dates
    const now = new Date();
    const endDate = new Date(now);
    if (memberShip.type === "recurring") {
        // If weekly, monthly, yearly → use interval from schema
        switch (memberShip.interval) {
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
                endDate.setDate(endDate.getDate() + 7); // fallback: 1 week
        }
    }
    else {
        // One-time plan → extend by durationInMonths
        endDate.setMonth(endDate.getMonth() + durationMonths);
    }
    // 2️⃣ Create pending subscription in DB
    const sub = yield payment_model_1.Subscription.create({
        userId,
        memberShipId,
        type: memberShip.type,
        status: "pending",
        startDate: now,
        endDate,
        signUpFeePaid: false,
        refundableDepositPaid: false,
    });
    try {
        // 3️⃣ Build Stripe line items
        const lineItems = [];
        // Membership base price
        lineItems.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: memberShip.name,
                    description: memberShip.description,
                },
                unit_amount: memberShip.price * 100,
                recurring: memberShip.type === "recurring"
                    ? { interval: memberShip.interval || "week" } // from schema
                    : undefined,
            },
            quantity: 1,
        });
        // Sign-up fee (if any)
        if (signUpFee > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Sign-Up Fee" },
                    unit_amount: signUpFee * 100,
                },
                quantity: 1,
            });
        }
        // Refundable deposit (if any)
        if (refundableDeposit > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: { name: "Refundable Deposit" },
                    unit_amount: refundableDeposit * 100,
                },
                quantity: 1,
            });
        }
        // 4️⃣ Create Stripe Checkout Session
        const session = yield stripe.checkout.sessions.create({
            mode: memberShip.type === "recurring" ? "subscription" : "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata: {
                subscriptionId: sub._id.toString(),
                type: memberShip.type,
                interval: memberShip.interval || "",
                durationMonths: durationMonths.toString(),
            },
        });
        return {
            message: "Checkout session created",
            status: 200,
            sessionUrl: session.url,
        };
    }
    catch (error) {
        // If Stripe session creation fails, remove the pending subscription
        yield payment_model_1.Subscription.findByIdAndDelete(sub._id);
        throw error;
    }
});
