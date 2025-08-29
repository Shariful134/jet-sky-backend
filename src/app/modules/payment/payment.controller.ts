import { Request, Response } from "express";
import { paymentServices } from "./payment.service";



const createCheckoutSession = async (req: Request, res: Response) => {
  try {

    const result = await paymentServices.createCheckoutSessionPayment(req);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
}

export const paymentController = {
  createCheckoutSession
};
