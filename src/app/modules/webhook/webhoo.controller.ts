import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
//   apiVersion: "2025-01-27",
});

// Controller for Stripe Webhook
export const webhookController = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

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
        console.log("✅ Checkout completed:", session.id);
        console.log("Customer: ", session);

        if (session.subscription) {
          console.log("New subscription created:", session.subscription);
          // TODO: Save subscription ID to your DB with userId (from metadata / client_reference_id)
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("✅ Subscription created:", subscription.id);
        console.log(subscription,'subscription');
        // TODO: Save subscription details in DB
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🔄 Subscription updated:", subscription.id);
        console.log(subscription,'subscription');
        // TODO: Update subscription status/plan in DB
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription canceled:", subscription.id);
        console.log(subscription,'subscription');
        // TODO: Mark subscription as canceled in DB
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded:", invoice.id);
        console.log(invoice,'invoice');
        // TODO: Record payment in DB, update user’s subscription status
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("⚠️ Payment failed:", invoice.id);
        console.log(invoice,'invoice');
        // TODO: Notify user to update payment method
        break;
      }

      default: {
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("❌ Error handling event:", err.message);
    res.status(500).send("Internal server error");
  }
};
