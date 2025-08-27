import { Request } from "express";
import AppError from "../../../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import config, { stripe } from "../../../../config";


// create Subscription
const createSubscriptionIntoDB = async (req: Request) => {
    const plan = req.query.plan;
    console.log(plan)

    if (!plan || typeof plan !== "string") {
        throw new AppError(StatusCodes.BAD_REQUEST, "Subscription not Found!");
    }
    //link= "/subscribe?plan=starter"
    let priceId: string | undefined;

    switch (plan.toLowerCase()) {
        case "starter":
            priceId = "price_1S05scFe9eL9ytjz8AUv7Z1g";
            break;
        case "pro":
            priceId = "price_1S0lirFe9eL9ytjzMIjJBF5z";
            break;

        default:
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid plan!");
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata:{},
        subscription_data:{
            metadata:{}
        },
        success_url: `${config.base_rul}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.base_rul}/cancel`,
    });
   
    return {url_Link:session.url};
};

const getSuccessSubscriptionIntoDB = async (req: Request) => {

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id as string, {expand:["subscription", "subscription.plan.product"]} );
    console.log("get_Success Session: ",JSON.stringify(session))
    return "Subscribed";
};

// const cancelSubscriptionIntoDB = async (req: Request) => {

//   const session = await stripe.checkout.sessions.create(req.query.session_id);
//   console.log(session)
//   return "Subscribed";
// };

export const subscriptionServices = {
    createSubscriptionIntoDB,
    getSuccessSubscriptionIntoDB
};
