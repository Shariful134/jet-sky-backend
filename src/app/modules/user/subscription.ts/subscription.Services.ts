import { Request } from "express";
import AppError from "../../../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { MemberShip } from "../../memberShip/memberShip.model";
import Stripe from "stripe";
import config from "../../../../config";
import { CustomJwtPayload } from "../../../../interface";
import jwt from 'jsonwebtoken';
import { IMemberShip } from "../../memberShip/memberShip.interface";
import { Subscription } from "./subscription.Model";

type MembershipPlan = {
    _id: string;
    duration: number;
    ridesPerMonth: number;
    refundableDeposit: number;
    signUpFee: number;
    price: number;
    planId: string;
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
        planId: memberShipData?.planId,
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
                price: memberShipData?.planId,
                quantity: subscriptionData.intervalCount,
            },
            {
                // একবারের signUpFee ($2000)
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Sign-up Fee",
                    },
                    unit_amount: 2000 * 100, // Stripe amounts are in cents
                },
                quantity: 1,
            },
        ],

        mode: "subscription",
        success_url: "http://localhost:3000/subscription/success",
        cancel_url: "http://localhost:3000/subscription/cancel",
        customer_email: decoded?.userEmail,
        subscription_data: {
            metadata: {
                userId: decoded.id,
                memberShipPlanId: req.body.memberShipPlanId,
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
            signUpFee: "2000",
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

// Get Single Subscription
const getSingleSubscriptionIntoDB = async (id: string) => {
    const result = await Subscription.findById(id).populate("membershipId").populate("userId");
    if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Subscription is not Found!');
    }
    return result;
};

// Get All Subscription
const getAllSubscriptionIntoDB = async () => {

    const result = await Subscription.find().populate("membershipId").populate("userId");

    //checking memberShip is exists
    if (!result) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Subscription is not Found!');
    }
    return result;
};

export const subscriptionServices = {
    createSubscriptionIntoDB,
    getSingleSubscriptionIntoDB,
    getAllSubscriptionIntoDB
 
};




// import { Request } from "express";
// import AppError from "../../../../errors/AppError";
// import { StatusCodes } from "http-status-codes";
// import { MemberShip } from "../../memberShip/memberShip.model";
// import Stripe from "stripe";
// import config from "../../../../config";
// import { CustomJwtPayload } from "../../../../interface";
// import jwt from 'jsonwebtoken';
// import { Subscription } from "./subscription.Model";

// type MembershipPlan = {
//     _id: string;
//     durationInMonths: number;
//     ridesPerMonth: number;
//     refundableDeposit: number;
//     signUpFee: number;
//     price: number;
//     planId: string;
//     description: string;
//     createdAt: Date;
//     updatedAt: Date;
//     __v: number;
// };



// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     //   ServerApiVersion: ""
// });

// // create Subscription
// const createSubscriptionIntoDB = async (req: Request) => {

//     const memberShipData = await MemberShip.findById(req?.body?.memberShipPlanId) as MembershipPlan


//     if (!memberShipData) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "MemberShip is not found!");
//     }
//     const plan = req.query.planId;

//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
//     }

//     // if token is Bearer then do split
//     const token = authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : authHeader;

//     // decoded the token
//     let decoded;
//     try {
//         decoded = jwt.verify(
//             token,
//             config.jwt_access_secret as string,
//         ) as CustomJwtPayload;
//     } catch (error) {
//         throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
//     }


//     // console.log("decoded: ", decoded)
//     // console.log("memberShipData: ", memberShipData)

//     // const subscriptionData = MemberShip.findById(req.params.id);

//     // const subscription = req.query.subscriptionData;

//     // const planMapping: Record<number, string> = {
//     //     24: config.planId_24 as string,
//     //     12: config.planId_12 as string,
//     //     6: config.planId_6 as string
//     // };


//     // const duration = memberShipData?.durationInMonths;

//     // const planId = planMapping[duration] || "default-plan";
//     // const test = Math.floor(
//     //   new Date().setMonth(new Date().getMonth() + duration) / 1000
//     // )

//     // console.log(test, "test:========>")
//     // console.log(planId, "PlanId:========>")
//     // memberShipData?.durationInMonths
//     const planId = memberShipData?.planId
//     console.log(memberShipData?.durationInMonths, "MemberShip durationInMonths:========>")


//     const subscriptionData = {
//         userId: decoded?.id,
//         memberShipPlanId: req?.body?.memberShipPlanId,
//         userEmail: decoded?.userEmail,
//         usreRole: decoded?.role,
//         planName: "pro",
//         price: `${memberShipData?.price}`,
//         currency: "USD",
//         interval: "monthy",
//         featuresList: ["Feature 1", "Feature 2", "Feature 3"],
//         planId: planId,
//         intervalCount: 1
//     }



//     // const user = {
//     //    email: "masdfsdf@gmail.com",
//     //    customerId: "cus_LzYwMj9dM2mK2s"
//     // }


//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price: planId,
//                 quantity: 1,
//             },
//             {
//                 price_data: { // 👉 One-time 2000$ charge
//                     currency: "usd",
//                     product_data: {
//                         name: "Sign-up Fee",
//                     },
//                     unit_amount: 2000 * 100, // Stripe amounts are in cents
//                 },
//                 quantity: 1,
//             },
//         ],

//         mode: "subscription",
//         success_url: "http://localhost:3000/subscription/success",
//         cancel_url: "http://localhost:3000/subscription/cancel",
//         customer_email: decoded?.userEmail,
//         subscription_data: {
//             metadata: {
//                 planId: memberShipData?.planId,
//                 planName: subscriptionData.planName,
//                 price: subscriptionData.price,
//                 currency: subscriptionData.currency,
//                 interval: 24

//             }
//         },
//         metadata: {
//             userId: decoded?.id,
//             memberShipPlanId: req?.body?.memberShipPlanId,
//             planId: subscriptionData?.planId,
//             planName: subscriptionData?.planName,
//             price: memberShipData?.price.toString(),
//             currency: subscriptionData?.currency,
//             interval: memberShipData?.durationInMonths,
//         }

//     });


//     // console.log(session)

//     return { url_Link: session.url };
// };





// export const subscriptionServices = {
//     createSubscriptionIntoDB,
//     getSingleSubscriptionIntoDB,
//     getAllSubscriptionIntoDB,
//     // getSuccessSubscriptionIntoDB,
//     // getportalSubscriptionIntoDB
// };
