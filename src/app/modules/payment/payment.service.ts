import { memberShipServices } from "../memberShip/memberShip.services";
import { stripe } from "../../../config"; // must be initialized Stripe
import Stripe from "stripe";
import { Request } from "express";
import { AdventurePack } from "../adventurePack/adventurePack.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import { Rent } from "../rents/rents.model";






// stripe listen --forward-to http://localhost:5000/webhooks
//stripe open






const createCheckoutSessionPayment = async (req: Request) => {
  const payload = req.body
  console.log(payload, 'here more  info add here')

  const productName = payload?.adventurePackId
    ? "AdventurePack"
    : payload?.rentId
    ? "RentalPack"
    : "Membership Plan";
  
  const productDescription = payload?.adventurePackId
    ? "One-time AdventurePack"
    : payload?.rentId
    ? "One-time RentalPack"
    : "One-time Membership";
  
  const priceAmount = payload?.price ? payload.price : "";
  // // 1️⃣ Fetch membership details from DB
  // const memberShip = await memberShipServices.getSingleMemberShipIntoDB(
  //   memberShipId
  // );

  // if (!memberShip) {
  //   throw new Error("Membership not found");
  // }

  // 2️⃣ Create Stripe Checkout Session

  let adventurePack
  if (payload?.adventurePackId) {
    adventurePack = await AdventurePack.findById(payload?.adventurePackId)

    if (!adventurePack) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
    }
  }


  //RentPack
  let rent
  if (payload?.rentId) {
    rent = await Rent.findById(payload?.rentId)

    if (!rent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
  }



  // Prepare metadata dynamically
  const metadata: Record<string, string> = {
  userId: payload.userId?.toString() || "",
  bookingType: payload.adventurePackId ? "AdventurePack" : payload.rentId ? "Rent" : "Membership",
  ridesNumber: payload.ridesNumber?.toString() || "1",
  price: payload.price?.toString() || "0",
};


  // Only add the ID that exists
  if (payload.adventurePackId) {
    metadata.adventurePackId = payload.adventurePackId.toString();
  } else if (payload.rentId) {
    metadata.rentId = payload.rentId.toString();
  }
  console.log(metadata)
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description: productDescription,
          },
          unit_amount:Number(priceAmount) * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata,
    locale: "en"
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