"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const path_1 = __importDefault(require("path"));
const subscription_Controllers_1 = require("./app/modules/user/subscription.ts/subscription.Controllers");
const webhoo_controller_1 = require("./app/modules/webhook/webhoo.controller");
const auth_1 = __importDefault(require("./middlewares/auth"));
const app = (0, express_1.default)();
exports.corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.post("/webhooks", body_parser_1.default.raw({ type: "application/json" }), webhoo_controller_1.webhookController);
//middleware setup
app.use((0, cors_1.default)(exports.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Setup API routes
app.use("/api/v1", routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get('/', (req, res) => {
    res.send('Jet Sky Server Hello!');
});
//stripe subscription
app.post('/subscribe', (0, auth_1.default)("User"), subscription_Controllers_1.subscriptionControllers.createSubscription);
// app.get('/success', subscriptionControllers.getSuccessSubscription);
// app.get('/customers/:customerId', subscriptionControllers.getPortalSubscription);
app.get('/cancel', (req, res) => {
    res.redirect("/");
});
// Error Handler
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
