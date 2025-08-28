import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import { subscriptionServices } from "./subscription.Services";

// create subscription
const createSubscription = catchAsync(async (req, res) => {

  const result = await subscriptionServices.createSubscriptionIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Your Subscription Created Successfully",
    data: [result],
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
 
  const {id} = req.params
  const result = await subscriptionServices.getSingleSubscriptionIntoDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subsribtion Retirived Successfully",
    data: [result],
  });
});

const getAllSubscription = catchAsync(async (req, res) => {
 
  const result = await subscriptionServices.getAllSubscriptionIntoDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subsribtion Retrieved Successfully",
    data: [result],
  });
});

export const subscriptionControllers = {
  createSubscription,
  getSingleSubscription,
  getAllSubscription,
  // getSuccessSubscription,
  // getPortalSubscription,
};
