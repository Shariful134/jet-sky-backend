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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const subscription_Services_1 = require("./subscription.Services");
// create subscription
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req)
    const result = yield subscription_Services_1.subscriptionServices.createSubscriptionIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Your Subscription Created Successfully",
        data: [result],
    });
}));
// const getSuccessSubscription = catchAsync(async (req, res) => {
//   const result = await subscriptionServices.getSuccessSubscriptionIntoDB(req);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Subsribe Successfully",
//     data: [result],
//   });
// });
// const getPortalSubscription = catchAsync(async (req, res) => {
//   const result = await subscriptionServices.getportalSubscriptionIntoDB(req);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "portal Successfully",
//     data: [result],
//   });
// });
exports.subscriptionControllers = {
    createSubscription,
    // getSuccessSubscription,
    // getPortalSubscription,
};
