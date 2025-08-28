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
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId = "435983745", memberShipId = "9348534" } = req.body;
        console.log(userId, memberShipId, 'here more  info add here');
        const result = yield payment_service_1.paymentServices.createCheckoutSessionPayment(userId, memberShipId);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error("❌ Error creating checkout session:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create checkout session",
            error: error.message,
        });
    }
});
exports.paymentController = {
    createCheckoutSession
};
