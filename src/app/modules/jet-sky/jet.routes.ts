import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { jetSkyValidation } from "./jet.validation";
import { jetControllers } from "./jet.controllers";
import { upload } from "../../../middlewares/upload.middleware";
import attachFileToBody from "../../../middlewares/attachedFiletoBody";

const router = express.Router();

// create Jet
router.post(
	"/create", upload.single("image"), attachFileToBody, auth("Admin", "Administrator"),
	validateRequest(jetSkyValidation.jetSkyCreateSchema),
	jetControllers.createJet
);

// getSingle Jet
router.get(
	"/get/:id",
	jetControllers.getSingleJet
);

// get All Jet
router.get(
	"/get",
	jetControllers.getAllJet
);

// update Jet only admin and administrator
router.patch(
	"/update/:id", upload.single("image"), attachFileToBody, auth("Admin", "Administrator"),
	validateRequest(jetSkyValidation.jetSkyUpdateSchema),
	jetControllers.updateJet
);

// delete jet
router.delete(
	"/delete/:id", auth("Admin", "Administrator"),
	jetControllers.deleteJet
);

export const jetRoutes = router;

