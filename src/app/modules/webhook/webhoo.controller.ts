import { Request, Response } from "express";
import Stripe from "stripe";
import { Subscription } from "../user/subscription.ts/subscription.Model";
import { Payment } from "../payment/payment.model";
import { Booking, PurchaseAdventurePack, PurchaseRentPack } from "../booking/booking.Model";

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
        // console.log(session, "session of WEBSHOOK CONTROLER================>")
        break;
        // const userId = session.metadata?.userId;
        // const membershipId = session.metadata?.memberShipPlanId;

        // if (session.subscription && userId && membershipId) {
        //   const startDate = new Date();
        //   let endDate: Date;

        //   // Safe endDate calculation
        //   try {
        //     endDate = new Date(startDate);
        //     endDate.setMonth(endDate.getMonth() + 1); 
        //     if (isNaN(endDate.getTime())) {
        //       throw new Error("Invalid endDate");
        //     }
        //   } catch (error) {
        //     console.log("Invalid endDate, using startDate as fallback");
        //     endDate = startDate;
        //   }

        //   await Subscription.create({
        //     userId,
        //     membershipId,
        //     type: "recurring",
        //     stripeSubscriptionId: session.subscription as string,
        //     status: "active",
        //     startDate,
        //     endDate,
        //     signUpFeePaid: false,
        //     refundableDepositPaid: false,
        //     refundAmount: 0,
        //     damagesDeducted: 0,
        //   });

        //   console.log("🎉 Subscription saved in DB");
        // }
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        const startDate = subscription.start_date
          ? new Date(subscription.start_date * 1000)
          : new Date();

        const endDate = (subscription as any).current_period_end
          ? new Date((subscription as any).current_period_end * 1000)
          : new Date();

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            userId: subscription.metadata?.userId,
            membershipId: subscription.metadata?.memberShipPlanId,
            type: "recurring",
            stripeSubscriptionId: subscription.id,
            status: "active",
            startDate,
            endDate,
            signUpFeePaid: true,   // ✅ signup fee paid
            refundableDepositPaid: false,
            refundAmount: 0,
            damagesDeducted: 0,
          },
          { upsert: true, new: true }
        );
        console.log("🎉 Subscription CREATED & saved in DB");
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        //  const userId = session.metadata?.userId;
        // const membershipId = session.metadata?.memberShipPlanId;


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

      case "payment_intent.succeeded": {
        // const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // const metadata = paymentIntent.metadata || {};
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // checkout session থেকে metadata ফেচ করো
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessions.data[0];
        // console.log(session, "session of payment_intent.succeeded WEBSHOOK CONTROLER================>")
        // Determine type
        // const type = metadata.adventurePackId || metadata.rentId || metadata.JetSkyId ? "onetime" : "recurring";

        const metadata = session?.metadata || {};
        const type = metadata.productId ? "onetime" : "recurring";

        const startDate = new Date();
        let endDate = new Date(startDate);

        if (metadata.adventurePackId) {
          endDate.setMonth(endDate.getMonth() + 24);
          endDate.setUTCHours(23, 59, 59, 999);
        }
        console.log(metadata, "metadata===============================>")
        if (metadata?.bookingType === "JetSky") {
          await Booking.findByIdAndUpdate(metadata.productId, {
            // adventurePackId: metadata.adventurePackId || undefined,
            // ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
            jetSkyId: metadata.jetSkyId || undefined,
            type,
            price: metadata.price ? parseFloat(metadata.price) : 0,
            stripePaymentIntentId: paymentIntent.id,
            status: "active",
            paymentStatus: "paid",
            startDate,
          },
            { new: true })
        }
        if (metadata?.bookingType === "AdventurePack") {

          const startDate = new Date();
          let expiryDate = new Date(startDate);


          expiryDate.setMonth(expiryDate.getMonth() + 24);
          expiryDate.setUTCHours(23, 59, 59, 999);

          await PurchaseAdventurePack.findByIdAndUpdate(metadata.productId, {
            type,
            ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
            price: metadata.price ? parseFloat(metadata.price) : 0,
            stripePaymentIntentId: paymentIntent.id,
            status: "active",
            paymentStatus: "paid",
            startDate,
            expiryDate
          },
            { new: true })
        }
        if (metadata?.bookingType === "RentPack") {
          await PurchaseRentPack.findByIdAndUpdate(metadata.productId, {
            type,
            ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
            price: metadata.price ? parseFloat(metadata.price) : 0,
            stripePaymentIntentId: paymentIntent.id,
            status: "active",
            paymentStatus: "paid",
            startDate,
          },
            { new: true })
        }
        // if(metadata?.bookingType === "RentPack" ){
        //   await Booking.findByIdAndUpdate(metadata.bookingId, {
        //   adventurePackId: metadata.adventurePackId || undefined,
        //   rentId: metadata.productId || undefined,
        //   type,
        //   ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
        //   price: metadata.price ? parseFloat(metadata.price) : 0,
        //   stripePaymentIntentId: paymentIntent.id,
        //   status: "active",
        //   paymentStatus: "paid",
        //   startDate,
        // },
        //   { new: true })
        // }

        // await Booking.create({
        //   userId: metadata.userId,
        //   adventurePackId: metadata.adventurePackId || undefined,
        //   rentId: metadata.rentId || undefined,
        //   type,
        //   ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
        //   price: metadata.price ? parseFloat(metadata.price) : 0,
        //   stripePaymentIntentId: paymentIntent.id,
        //   status: "active",
        //   startDate,
        //   endDate,
        // });
        await Payment.create({
          userId: metadata.userId,
          adventurePackId: metadata.adventurePackId || undefined,
          rentId: metadata.rentId || undefined,
          type,
          ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
          price: metadata.price ? parseFloat(metadata.price) : 0,
          stripePaymentIntentId: paymentIntent.id,
          status: "active",
          startDate,
          endDate,
        });
        console.log("✅ Payment saved successfully");
        break;
      }

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
