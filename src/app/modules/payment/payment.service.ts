import { memberShipServices } from "../memberShip/memberShip.services";
import { stripe } from "../../../config"; // must be initialized Stripe
import Stripe from "stripe";


  const createCheckoutSessionPayment = async (userId: any, memberShipId: any) => {
    // // 1️⃣ Fetch membership details from DB
    // const memberShip = await memberShipServices.getSingleMemberShipIntoDB(
    //   memberShipId
    // );

    // if (!memberShip) {
    //   throw new Error("Membership not found");
    // }

    // 2️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", 
            product_data: {
              name:   "Membership Plan",
              description:  "One-time membership",
            },
            unit_amount: 345 * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId,
        memberShipId,
        fakeValue: "test-metadata-123",
      },
    });

    return {
      message: "Checkout session created",
      sessionUrl: session.url,
    };
  }


// add more  service here


export const paymentServices = {
   createCheckoutSessionPayment,
   // input the 
};