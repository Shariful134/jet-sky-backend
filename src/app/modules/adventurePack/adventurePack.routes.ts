import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { adventurePackValidation } from "./adventure.Validation";
import { adventurePackControllers } from "./adventurePack.Controllers";

const router = express.Router();

// create AdventurePack
router.post(
	"/create", auth("Admin", "Administrator"),
	validateRequest(adventurePackValidation.adventurePackCreateSchema),
	adventurePackControllers.createAdventurePack
);

// getSingle AdventurePack
router.get(
	"/get/:id",
	adventurePackControllers.getSingleAdventurePack
);

// get All AdventurePack
router.get(
	"/get",
	adventurePackControllers.getAllAdventurePack
);

// update AdventurePack only admin and administrator
router.patch(
	"/update/:id", auth("Admin", "Administrator"),
	validateRequest(adventurePackValidation.adventurePackUpdateSchema),
	adventurePackControllers.updateAdventurePack
);

// delete AdventurePack
router.delete(
	"/delete/:id", auth("Admin", "Administrator"),
	adventurePackControllers.deleteAdventurePack
);

export const adventurePackRoutes = router;

