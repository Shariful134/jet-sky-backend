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
exports.subscriptionServices = void 0;
const AppError_1 = __importDefault(require("../../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const memberShip_model_1 = require("../../memberShip/memberShip.model");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
//   ServerApiVersion: ""
});
// create Subscription
const createSubscriptionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const plan = req.query.planId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
    }
    // if token is Bearer then do split 
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    // decoded the token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    const memberShipData = yield memberShip_model_1.MemberShip.findById((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.memberShipPlanId);
    console.log("decoded: ", decoded);
    console.log("memberShipData: ", memberShipData);
    // const subscriptionData = MemberShip.findById(req.params.id);
    // const subscription = req.query.subscriptionData;
    const subscriptionData = {
        userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
        memberShipPlanId: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.memberShipPlanId,
        userEmail: decoded === null || decoded === void 0 ? void 0 : decoded.userEmail,
        usreRole: decoded === null || decoded === void 0 ? void 0 : decoded.role,
        planName: "pro",
        price: `${memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.pricing}`,
        currency: "USD",
        interval: "week",
        featuresList: ["Feature 1", "Feature 2", "Feature 3"],
        planId: "price_1S0lirFe9eL9ytjzMIjJBF5z",
        intervalCount: 1
    };
    // const user = {
    //    email: "masdfsdf@gmail.com",
    //    customerId: "cus_LzYwMj9dM2mK2s"
    // }
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: "price_1S05scFe9eL9ytjz8AUv7Z1g",
                quantity: subscriptionData.intervalCount,
            },
        ],
        mode: "subscription",
        success_url: "http://localhost:3000/subscription/success",
        cancel_url: "http://localhost:3000/subscription/cancel",
        customer_email: decoded === null || decoded === void 0 ? void 0 : decoded.userEmail,
        subscription_data: {
            metadata: {
                planId: subscriptionData.planId,
                planName: subscriptionData.planName,
                price: subscriptionData.price,
                currency: subscriptionData.currency,
                interval: subscriptionData.interval
            }
        },
        metadata: {
            planId: subscriptionData.planId,
            planName: subscriptionData.planName,
            price: subscriptionData.price,
            currency: subscriptionData.currency,
            interval: subscriptionData.interval,
        }
    });
    return { url_Link: session.url };
});
// const getSuccessSubscriptionIntoDB = async (req: Request) => {
//     const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string, {expand:["subscription", "subscription.plan.product"]} );
//     console.log("get_Success Session: ",JSON.stringify(session))
//     return "Subscribed";
// };
// //portamsession
// const getportalSubscriptionIntoDB = async (req: Request) => {
// const portalSession = await stripe.billingPortal.sessions.create({
//     customer:req.params.customerId,
//     return_url:`${config.base_rul}/`
// })
// console.log(portalSession)
// };
// const cancelSubscriptionIntoDB = async (req: Request) => {
//   const session = await stripe.checkout.sessions.create(req.query.session_id);
//   console.log(session)
//   return "Subscribed";
// };
exports.subscriptionServices = {
    createSubscriptionIntoDB,
    // getSuccessSubscriptionIntoDB,
    // getportalSubscriptionIntoDB
};
