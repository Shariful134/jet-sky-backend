import { Request, Response } from "express";
import { paymentServices } from "./payment.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

const createPaymentCtrl = async (req: Request, res: Response) => {
  try {
    const { userId, memberShipId } = req.body;

    const result = await paymentServices.createCheckoutSessionCtrl({
      userId,
      memberShipId,
    });

    if (result.status && result.status !== 200) {
      sendResponse(res, {
        statusCode: result.status,
        success: false,
        message: result.message,
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in createPaymentCtrl:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
