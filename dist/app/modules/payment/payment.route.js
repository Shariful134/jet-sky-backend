"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post("/create-pakage", payment_controller_1.paymentController.createCheckoutSession);
exports.paymentRoute = router;
