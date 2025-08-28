import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { jetRoutes } from "../modules/jet-sky/jet.routes";
import { memberShipRoutes } from "../modules/memberShip/memberShipt.routes";
import { adventurePackRoutes } from "../modules/adventurePack/adventurePack.routes";
import { rentRoutes } from "../modules/rents/rent.Routes";
import { paymentRoute } from "../modules/payment/payment.route";
import { subscriptionShipRoutes } from "../modules/user/subscription.ts/subscription.Routes";


const router = express.Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: AuthRoutes,
	},
	{
		path: "/jet",
		route: jetRoutes,
	},
	{
		path: "/memberShip",
		route: memberShipRoutes,
	},
	{
		path: "/adventurePack",
		route: adventurePackRoutes,
	},
	{
		path: "/rent",
		route: rentRoutes,
	},
	{
		path: "/payment",
		route: paymentRoute,
	},
	{
		path: "/subscription",
		route: subscriptionShipRoutes,
	}
	
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;