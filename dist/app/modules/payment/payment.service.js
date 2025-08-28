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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
const config_1 = require("../../../config"); // must be initialized Stripe
const createCheckoutSessionPayment = (userId, memberShipId) => __awaiter(void 0, void 0, void 0, function* () {
    // // 1️⃣ Fetch membership details from DB
    // const memberShip = await memberShipServices.getSingleMemberShipIntoDB(
    //   memberShipId
    // );
    // if (!memberShip) {
    //   throw new Error("Membership not found");
    // }
    // 2️⃣ Create Stripe Checkout Session
    const session = yield config_1.stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Membership Plan",
                        description: "One-time membership",
                    },
                    unit_amount: 345 * 100,
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        metadata: {
            userId,
            memberShipId,
            fakeValue: "test-metadata-123",
        },
    });
    return {
        message: "Checkout session created",
        sessionUrl: session.url,
    };
});
// add more  service here
exports.paymentServices = {
    createCheckoutSessionPayment,
    // input the 
};
