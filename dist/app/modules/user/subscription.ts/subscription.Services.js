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
const config_1 = __importDefault(require("../../../../config"));
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);
// create Subscription
const createSubscriptionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = req.query.plan;
    console.log(plan);
    if (!plan || typeof plan !== "string") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Subscription not Found!");
    }
    //link= "/subscribe?plan=starter"
    let priceId;
    switch (plan.toLowerCase()) {
        case "starter":
            priceId = "price_1S05scFe9eL9ytjz8AUv7Z1g";
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid plan!");
    }
    const session = yield stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${config_1.default.base_rul}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_1.default.base_rul}/cancel`,
    });
    console.log(session);
    return session;
});
const getSuccessSubscriptionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log("get_Success: ", session);
    return "Subscribed";
});
// const cancelSubscriptionIntoDB = async (req: Request) => {
//   const session = await stripe.checkout.sessions.create(req.query.session_id);
//   console.log(session)
//   return "Subscribed";
// };
exports.subscriptionServices = {
    createSubscriptionIntoDB,
    getSuccessSubscriptionIntoDB
};
