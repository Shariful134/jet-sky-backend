import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookiePerser from 'cookie-parser';
import bodyParser from 'body-parser';
import router from './app/routes';
import globalErrorHandler from './middlewares/globalErrorhandler';
import notFound from './middlewares/notFound';
import path from "path"
import { subscriptionControllers } from './app/modules/user/subscription.ts/subscription.Controllers';
import { stripeWebhook } from './utils/stripeWebhook';
import config from './config';

const app: Application = express();

export const corsOptions = {
	origin: ["http://localhost:3000", "http://localhost:3001"],
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

//middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookiePerser());

// Setup API routes
app.use("/api/v1", router);

app.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get('/', (req: Request, res: Response) => {
	res.send('Jet Sky Server Hello!');
});


//stripe subscription
app.get('/subscribe', subscriptionControllers.createSubscription);
app.get('/success', subscriptionControllers.getSuccessSubscription);

app.get('/cancel', (req, res) => {
	res.redirect("/")
});

// Error Handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;