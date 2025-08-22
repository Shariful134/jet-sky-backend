import express from "express";

import { authValidation } from "./auth.validation";

import { authControllers } from "./auth.controllers";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/ValidateRequest";

const router = express.Router();

// Admin register
router.post(
	"/admin/register",
	validateRequest(authValidation.userRegisterSchema),
	authControllers.registerAdmin
);

// Administrator register
router.post(
	"/administrator/register", auth("Admin"),
	validateRequest(authValidation.userRegisterSchema),
	authControllers.registerAdministrator
);

// User register
router.post(
	"/user/register",
	validateRequest(authValidation.userRegisterSchema),
	authControllers.registerUser
);

// User login
router.post(
	"/login",
	validateRequest(authValidation.loginValidationschema),
	authControllers.loginUser
);

// getSingle User
router.get(
	"/getUser/:id",
	authControllers.getSingleUser
);

// getAll User with administrator and without admin
router.get(
	"/getAll/user",
	authControllers.getAllUser
);

// delete User
router.delete(
	"/delete/user/:id",auth("Admin", "Administrator"),
	authControllers.deleteUser
);

// Updated User
router.patch(
	"/update/user/:id",
	// auth("Admin", "Administrator", "User"),
	authControllers.updateUser
);

// // getSingle Administrator
// router.get(
// 	"/getSingle/administrator",
// 	authControllers.getSingleAdministrator
// );

// // getAllAdministrator
// router.get(
// 	"/getAll/administrator",
// 	authControllers.getAllAdministrator
// );


// // delete Administrator
// router.delete(
// 	"/delete/administrator",auth("Admin"),
// 	authControllers.deleteAdministrator
// );

export const AuthRoutes = router;

