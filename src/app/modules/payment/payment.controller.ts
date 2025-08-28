import { Request, Response } from "express";
import { paymentServices } from "./payment.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import AppError from "../../../errors/AppError";

const createPaymentCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { _id } = req.user as unknown as { _id: string };

    const result = await paymentServices.createCheckoutSessionCtrl({
      userId: _id,
      memberShipId: id,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in createPaymentCtrl:", error);
    new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error");
  }
};

export const paymentController = {
  createPaymentCtrl,
};
