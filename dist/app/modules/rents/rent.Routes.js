"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const rents_Validation_1 = require("./rents.Validation");
const rents_Controllers_1 = require("./rents.Controllers");
const router = express_1.default.Router();
// create Rent
router.post("/create", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(rents_Validation_1.rentValidation.rentCreateSchema), rents_Controllers_1.rentControllers.createRent);
// getSingle rent
router.get("/get/:id", rents_Controllers_1.rentControllers.getSingleRent);
// get All Jet
router.get("/get", rents_Controllers_1.rentControllers.getAllRent);
// update Rent only admin and administrator
router.patch("/update/:id", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(rents_Validation_1.rentValidation.rentUpdateSchema), rents_Controllers_1.rentControllers.updateRent);
// delete jet
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), rents_Controllers_1.rentControllers.deleteRent);
exports.rentRoutes = router;
// "zod": "^4.1.0",
// "zod-validation-error": "^4.0.1"
