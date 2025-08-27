import { Request, Response } from "express";
import { get } from "mongoose";
import { memberShipServices } from "../memberShip/memberShip.services";
import { Subscription } from "./payment.model";
import config, { stripe } from "../../../config";
import Stripe from "stripe";

const createCheckoutSessionCtrl = async ({
  userId,
  memberShipId,
}: {
  userId: string;
  memberShipId: string;
}) => {
  const memberShip = await memberShipServices.getSingleMemberShipIntoDB(
    memberShipId
  );

  if (!memberShip) {
    return {
      message: "MemberShip not found",
      status: 404,
    };
  }

  // Extract values safely from schema
  const durationMonths = memberShip.durationInMonths || 1;
  const signUpFee = memberShip.signUpFee || 0;
  const refundableDeposit = memberShip.refundableDeposit || 0;

  // 1️⃣ Calculate subscription dates
  const now = new Date();
  const endDate = new Date(now);

  if (memberShip.type === "recurring") {
    // If weekly, monthly, yearly → use interval from schema
    switch (memberShip.interval) {
      case "day":
        endDate.setDate(endDate.getDate() + 1);
        break;
      case "week":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "month":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "year":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setDate(endDate.getDate() + 7); // fallback: 1 week
    }
  } else {
    // One-time plan → extend by durationInMonths
    endDate.setMonth(endDate.getMonth() + durationMonths);
  }

  // 2️⃣ Create pending subscription in DB
  const sub = await Subscription.create({
    userId,
    memberShipId,
    type: memberShip.type,
    status: "pending",
    startDate: now,
    endDate,
    signUpFeePaid: false,
    refundableDepositPaid: false,
  });

  try {
    // 3️⃣ Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Membership base price
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: memberShip.name,
          description: memberShip.description,
        },
        unit_amount: memberShip.price * 100,
        recurring:
          memberShip.type === "recurring"
            ? { interval: memberShip.interval || "week" } // from schema
            : undefined,
      },
      quantity: 1,
    });

    // Sign-up fee (if any)
    if (signUpFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Sign-Up Fee" },
          unit_amount: signUpFee * 100,
        },
        quantity: 1,
      });
    }

    // Refundable deposit (if any)
    if (refundableDeposit > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Refundable Deposit" },
          unit_amount: refundableDeposit * 100,
        },
        quantity: 1,
      });
    }

    // 4️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: memberShip.type === "recurring" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        subscriptionId: sub._id.toString(),
        type: memberShip.type,
        interval: memberShip.interval || "",
        durationMonths: durationMonths.toString(),
      },
    });

    return {
      message: "Checkout session created",
      status: 200,
      sessionUrl: session.url,
    };
  } catch (error) {
    // If Stripe session creation fails, remove the pending subscription
    await Subscription.findByIdAndDelete(sub._id);
    throw error;
  }
};
