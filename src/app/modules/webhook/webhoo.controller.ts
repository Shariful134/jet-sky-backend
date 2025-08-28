import { Request, Response } from "express";
import Stripe from "stripe";
import { Subscription } from "../user/subscription.ts/subscription.Model";
import { MemberShip } from "../memberShip/memberShip.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
  // apiVersion: "2025-01-27",
});

export const webhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET! as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const membershipId = session.metadata?.memberShipPlanId;

        if (session.subscription && userId && membershipId) {

          const memberShipData= await MemberShip.findById(membershipId)

          const startDate = new Date();
          let endDate: Date;

          // Safe endDate calculation
          try {
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1); 
            if (isNaN(endDate.getTime())) {
              throw new Error("Invalid endDate");
            }
          } catch (error) {
            console.log("Invalid endDate, using startDate as fallback");
            endDate = startDate;
          }

          await Subscription.create({
            userId,
            membershipId,
            type: "recurring",
            stripeSubscriptionId: session.subscription as string,
            status: "active",
            startDate,
            endDate,
            signUpFeePaid: memberShipData?.signUpFee,
            refundableDepositPaid: memberShipData?.refundableDeposit,
            refundAmount: 0,
            damagesDeducted: 0,
          });

          console.log("🎉 Subscription saved in DB");
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const startDate =
          subscription.start_date !== undefined
            ? new Date(subscription.start_date * 1000)
            : new Date();

        const currentPeriodEnd = (subscription as any).current_period_end;
        const endDate =
          currentPeriodEnd !== undefined
            ? new Date(currentPeriodEnd * 1000)
            : new Date();

        if (isNaN(endDate.getTime())) {
          console.log("Invalid endDate from Stripe, using startDate as fallback");
        }

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            status:
              subscription.status === "active"
                ? "active"
                : subscription.status === "canceled"
                ? "canceled"
                : "pending",
            startDate,
            endDate: isNaN(endDate.getTime()) ? startDate : endDate,
          },
          { upsert: true, new: true }
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            status: "canceled",
            endDate: new Date(),
          }
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if ((invoice as any).subscription) {
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: (invoice as any).subscription as string },
            { status: "active" }
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if ((invoice as any).subscription) {
          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: (invoice as any).subscription as string },
            { status: "pending" }
          );
        }
        break;
      }

      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
        // Optional: log payment intents
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("❌ Error handling event:", err.message);
    res.status(500).send("Internal server error");
  }
};
