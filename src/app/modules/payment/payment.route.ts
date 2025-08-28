import express from "express";

const router = express.Router();

import { paymentController } from "./payment.controller";
import auth from "../../../middlewares/auth";

// create checkout session
router.post("/create/:id", auth("User"), paymentController.createPaymentCtrl);

export const paymentRoutes = router;