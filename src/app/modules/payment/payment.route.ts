import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create-pakage", paymentController.createCheckoutSession);

export  const paymentRoute = router;
