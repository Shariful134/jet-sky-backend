import { Request } from "express";
import AppError from "../../../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { MemberShip } from "../../memberShip/memberShip.model";
import Stripe from "stripe";
import config from "../../../../config";
import { CustomJwtPayload } from "../../../../interface";
import jwt from 'jsonwebtoken';
import { IMemberShip } from "../../memberShip/memberShip.interface";

type MembershipPlan = {
    _id: string;
    duration: number;
    ridesPerMonth: number;
    refundableDeposit: number;
    signUpFee: number;
    price: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    //   ServerApiVersion: ""
});

// create Subscription
const createSubscriptionIntoDB = async (req: Request) => {

    const memberShipData = await MemberShip.findById(req?.body?.memberShipPlanId) as MembershipPlan

    if (!memberShipData) {
        throw new AppError(StatusCodes.BAD_REQUEST, "MemberShip is not found!");
    }
    const plan = req.query.planId;

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
    }

    // if token is Bearer then do split 
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    // decoded the token
    let decoded;
    try {
        decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as CustomJwtPayload;
    } catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }


    // console.log("decoded: ", decoded)
    // console.log("memberShipData: ", memberShipData)

    // const subscriptionData = MemberShip.findById(req.params.id);

    // const subscription = req.query.subscriptionData;
    const subscriptionData = {
        userId: decoded?.id,
        memberShipPlanId: req?.body?.memberShipPlanId,
        userEmail: decoded?.userEmail,
        usreRole: decoded?.role,
        planName: "pro",
        price: `${memberShipData?.price}`,
        currency: "USD",
        interval: "monthy",
        featuresList: ["Feature 1", "Feature 2", "Feature 3"],
        planId: "price_1S0lirFe9eL9ytjzMIjJBF5z",
        intervalCount: 1
    }



    // const user = {
    //    email: "masdfsdf@gmail.com",
    //    customerId: "cus_LzYwMj9dM2mK2s"
    // }


    const session = await stripe.checkout.sessions.create({
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
        customer_email: decoded?.userEmail,
        subscription_data: {
            metadata: {
                planId: subscriptionData.planId,
                planName: subscriptionData.planName,
                price: subscriptionData.price,
                currency: subscriptionData.currency,
                interval: 24
                
            }
        },
        metadata: {
            userId: decoded?.id,
            memberShipPlanId: req?.body?.memberShipPlanId,
            planId: subscriptionData.planId,
            planName: subscriptionData.planName,
            price: subscriptionData.price,
            currency: subscriptionData.currency,
            interval: subscriptionData.interval,
        }

    });


    // console.log(session)

    return { url_Link: session.url };
};

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

export const subscriptionServices = {
    createSubscriptionIntoDB,
    // getSuccessSubscriptionIntoDB,
    // getportalSubscriptionIntoDB
};
