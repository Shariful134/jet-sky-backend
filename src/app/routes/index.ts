import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { jetRoutes } from "../modules/jet-sky/jet.routes";
import { memberShipRoutes } from "../modules/memberShip/memberShipt.routes";
import { adventurePackRoutes } from "../modules/adventurePack/adventurePack.routes";


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
	
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;