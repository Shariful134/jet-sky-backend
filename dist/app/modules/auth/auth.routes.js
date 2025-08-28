"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("./auth.validation");
const auth_controllers_1 = require("./auth.controllers");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const attachedFiletoBody_1 = __importDefault(require("../../../middlewares/attachedFiletoBody"));
const upload_middleware_1 = require("../../../middlewares/upload.middleware");
const router = express_1.default.Router();
// Admin register
router.post("/admin/register", (0, ValidateRequest_1.default)(auth_validation_1.authValidation.userRegisterSchema), auth_controllers_1.authControllers.registerAdmin);
// Administrator register
router.post("/administrator/register", (0, auth_1.default)("Admin"), (0, ValidateRequest_1.default)(auth_validation_1.authValidation.userRegisterSchema), auth_controllers_1.authControllers.registerAdministrator);
// User register
router.post("/user/register", (0, ValidateRequest_1.default)(auth_validation_1.authValidation.userRegisterSchema), auth_controllers_1.authControllers.registerUser);
// User login
router.post("/login", (0, ValidateRequest_1.default)(auth_validation_1.authValidation.loginValidationschema), auth_controllers_1.authControllers.loginUser);
// getSingle User
router.get("/getUser/:id", auth_controllers_1.authControllers.getSingleUser);
// getAll User with administrator and without admin
router.get("/getAll/user", auth_controllers_1.authControllers.getAllUser);
// delete User
router.delete("/delete/user/:id", (0, auth_1.default)("Admin", "Administrator"), auth_controllers_1.authControllers.deleteUser);
// Updated User
router.patch("/update/user/:id", upload_middleware_1.upload.single("image"), attachedFiletoBody_1.default, (0, ValidateRequest_1.default)(auth_validation_1.authValidation.userRegisterUpdateSchema), auth_controllers_1.authControllers.updateUser);
// Changes User Password
router.patch("/changePassword/:id", auth_controllers_1.authControllers.changeUserPassword);
// forget + reset password
router.post("/forgot-password", auth_controllers_1.authControllers.forgotPassword);
router.post("/reset-password", auth_controllers_1.authControllers.resetPassword);
// // user logout route
// router.post("/logout", AuthController.logoutUser);
// //change password
// router.put(
//   "/change-password",
//   auth(), checkBlockedStatus,
//   AuthController.changePassword
// );
// //reset password
// router.post("/reset-password", AuthController.resetPassword);
// //forgot password
// router.post("/forgot-password", AuthController.forgotPassword);
// //resend otp
// router.post("/resend-otp", AuthController.resendOtp);
// //verify-otp
// router.post("/verify-otp", AuthController.verifyForgotPasswordOtp);
// //user verify email
// router.post("/verify-email", AuthController.verifyEmail);
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
exports.AuthRoutes = router;
