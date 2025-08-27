import { Request, Response } from "express";
import { paymentServices } from "./payment.service";



 const  createCheckoutSession = async (req: Request, res: Response) => {
    try {
      const { userId, memberShipId } = req.body;

      if (!userId || !memberShipId) {
        return res.status(400).json({
          success: false,
          message: "userId and memberShipId are required",
        });
      }

      const result = await paymentServices.createCheckoutSessionPayment(
        userId,
        memberShipId
      );

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
    createCheckoutSession,
  };
