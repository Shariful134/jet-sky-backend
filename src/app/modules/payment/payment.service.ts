import { memberShipServices } from "../memberShip/memberShip.services";
import { stripe } from "../../../config"; // must be initialized Stripe
import Stripe from "stripe";
import { Request } from "express";
import { AdventurePack } from "../adventurePack/adventurePack.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import { Rent } from "../rents/rents.model";
import { JetSky } from "../jet-sky/jet.model";
import { PurchaseAdventurePack, PurchaseRentPack } from "../booking/booking.Model";






// stripe listen --forward-to http://localhost:5000/webhooks
//stripe open



const createCheckoutSessionPayment = async (req: Request) => {
  const payload = req.body
  

  const productName = payload?.adventurePurchaseId
    ? "AdventurePack"
    : payload?.rentPurchaseId
    ? "RentalPack"
    : " JetSky";
  
  const productDescription = payload?.adventurePurchaseId
    ? "One-time AdventurePack"
    : payload?.rentId
    ? "One-time RentalPack"
    : "One-time JetSky";
  
  const priceAmount = payload?.price ? payload.price : "";
  // // 1️⃣ Fetch membership details from DB
  // const memberShip = await memberShipServices.getSingleMemberShipIntoDB(
  //   memberShipId
  // );

  // if (!memberShip) {
  //   throw new Error("Membership not found");
  // }

  // 2️⃣ Create Stripe Checkout Session

  let purchaseadventure
  if (payload?.adventurePurchaseId) {
    purchaseadventure= await PurchaseAdventurePack.findById(payload?.adventurePurchaseId)

    if (!purchaseadventure) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack is not Found!');
    }
  }

  //RentPack
  let purchaseRent
  if (payload?.rentPurchaseId) {
    purchaseRent = await PurchaseRentPack.findById(payload?.rentPurchaseId)

    if (!purchaseRent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'PurchaseRent is not Found!');
    }
  }

  //jetSkyId
  let jetSky
  if (payload?.jetSky) {
    jetSky = await JetSky.findById(payload?.jetSkyId)

    if (!jetSky) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'jetSky is not Found!');
    }
  }

// let bookingId
// if(payload?.bookingId){
//   bookingId = payload?.bookingId
// }
  // Prepare metadata dynamically
  const metadata: Record<string, string> = {
  userId: payload.userId?.toString() || "",
  bookingType: payload.adventurePurchaseId ? "AdventurePack" : payload.rentPurchaseId ? "RentPack" : "JetSky",
  productId: payload.adventurePurchaseId ? payload.adventurePurchaseId : payload.rentPurchaseId ? payload.rentPurchaseId  : payload.bookingId ,
  // bookingId:payload.bookingId ? payload.bookingId.toString() : "",
  ridesNumber: purchaseadventure?.ridesNumber?.toString() || "1",
  price: payload.price?.toString() || "0",
};


  // Only add the ID that exists
  if (payload.adventurePurchaseId) {
    metadata.adventurePurchaseId = payload.adventurePurchaseId.toString();
  }

  if (payload.rentPurchaseId) {
    metadata.rentPurchaseId = payload.rentPurchaseId.toString();
  }

  if (payload.jetSkyId) {
    metadata.jetSkyId = payload.jetSkyId.toString();
  }
  
  console.log(payload, 'here more  info add here')
  console.log(metadata, 'here more  info add here metadata')
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

  console.log(session, "Check Session=========>>")

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