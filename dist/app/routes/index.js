"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const jet_routes_1 = require("../modules/jet-sky/jet.routes");
const memberShipt_routes_1 = require("../modules/memberShip/memberShipt.routes");
const adventurePack_routes_1 = require("../modules/adventurePack/adventurePack.routes");
const rent_Routes_1 = require("../modules/rents/rent.Routes");
const payment_route_1 = require("../modules/payment/payment.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/jet",
        route: jet_routes_1.jetRoutes,
    },
    {
        path: "/memberShip",
        route: memberShipt_routes_1.memberShipRoutes,
    },
    {
        path: "/adventurePack",
        route: adventurePack_routes_1.adventurePackRoutes,
    },
    {
        path: "/rent",
        route: rent_Routes_1.rentRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoute,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
