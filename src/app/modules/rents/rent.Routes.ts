import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { rentValidation } from "./rents.Validation";
import { rentControllers } from "./rents.Controllers";

const router = express.Router();

// create Rent
router.post(
	"/create", auth("Admin", "Administrator"),
	validateRequest(rentValidation.rentCreateSchema),
	rentControllers.createRent
);

// getSingle rent
router.get(
	"/get/:id",
	rentControllers.getSingleRent
);

// get All Jet
router.get(
	"/get",
	rentControllers.getAllRent
);

// update Rent only admin and administrator
router.patch(
	"/update/:id", auth("Admin", "Administrator"),
	validateRequest(rentValidation.rentUpdateSchema),
rentControllers.updateRent
);

// delete jet
router.delete(
	"/delete/:id", auth("Admin", "Administrator"),
	rentControllers.deleteRent
);

export const rentRoutes = router;

    // "zod": "^4.1.0",
    
    // "zod-validation-error": "^4.0.1"