import express from "express";
import { subscriptionControllers } from "./subscription.Controllers";

const router = express.Router();

// getSingle subscription
router.get(
	"/get/:id",
	subscriptionControllers.getSingleSubscription
);

// get All subscription
router.get(
	"/get",
	subscriptionControllers.getAllSubscription
);

export const subscriptionShipRoutes = router;

