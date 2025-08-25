import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import { subscriptionServices } from "./subscription.Services";

// create subscription
const createSubscription = catchAsync(async (req, res) => {
    console.log(req)
  const result = await subscriptionServices.createSubscriptionIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Your Subscription Created Successfully",
    data: [result],
  });
});

const getSuccessSubscription = catchAsync(async (req, res) => {
 
  const result = await subscriptionServices.getSuccessSubscriptionIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Subsribe Successfully",
    data: [result],
  });
});

export const subscriptionControllers = {
  createSubscription,
  getSuccessSubscription
};
