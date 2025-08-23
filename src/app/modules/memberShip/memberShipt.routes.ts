import express from "express";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";
import { memberShipValidation } from "./memberShip.validation";
import { memberShipControllers } from "./memberShip.controllers";

const router = express.Router();

// create MemberShip
router.post(
	"/create",auth("Admin", "Administrator"),
	validateRequest(memberShipValidation.memberShipCreateSchema),
	memberShipControllers.createMemberShip
);

// getSingle MemberShip
router.get(
	"/get/:id",
	memberShipControllers.getSingleMemberShip
);

// get All MemberShip
router.get(
	"/get",
	memberShipControllers.getAllMemberShip
);

// update MemberShip only admin and administrator
router.patch(
	"/update/:id", auth("Admin", "Administrator"),
validateRequest(memberShipValidation.memberShipUpdateSchema),
	memberShipControllers.updateMemberShip
);

// delete MemberShip
router.delete(
	"/delete/:id", auth("Admin", "Administrator"),
	memberShipControllers.deleteMemberShip
);

export const memberShipRoutes = router;

