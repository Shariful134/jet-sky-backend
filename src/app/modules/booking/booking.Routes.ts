import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { BookingValidation } from "./booking.Validation";
import { BookingContnrollers } from "./booking.Controllers";

const router = express.Router();

// create BookingJetSky
router.post(
	"/create/jetSky", auth("Admin", "Administrator", "User"),
	validateRequest(BookingValidation.jetSkyBookingValidation),
	BookingContnrollers.createBookingJetSky
);

// create BookingJetSky
router.post(
	"/purchase/adventurePack", auth("Admin", "Administrator", "User"),
	// validateRequest(BookingValidation.jetSkyBookingValidation),
	BookingContnrollers.purchaseAdventurePack
);

// // getSingle AdventurePack
// router.get(
// 	"/get/:id",
// 	adventurePackControllers.getSingleAdventurePack
// );

// // get All AdventurePack
// router.get(
// 	"/get",
// 	adventurePackControllers.getAllAdventurePack
// );

// // update AdventurePack only admin and administrator
// router.patch(
// 	"/update/:id", auth("Admin", "Administrator"),
// 	validateRequest(adventurePackValidation.adventurePackUpdateSchema),
// 	adventurePackControllers.updateAdventurePack
// );

// // delete AdventurePack
// router.delete(
// 	"/delete/:id", auth("Admin", "Administrator"),
// 	adventurePackControllers.deleteAdventurePack
// );

export const bookingRoutes = router;

