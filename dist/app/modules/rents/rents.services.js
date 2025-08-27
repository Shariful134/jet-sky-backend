"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const rents_model_1 = require("./rents.model");
const jet_model_1 = require("../jet-sky/jet.model");
// create Rent
const createRentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const jet_sky = yield jet_model_1.JetSky.findById(payload.jet_skyId);
    if (!jet_sky) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky is not Found!');
    }
    const hp = jet_sky === null || jet_sky === void 0 ? void 0 : jet_sky.hp;
    const modelNumber = jet_sky === null || jet_sky === void 0 ? void 0 : jet_sky.model;
    if (hp != (payload === null || payload === void 0 ? void 0 : payload.hp)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'HorsePower is not Match!');
    }
    if (modelNumber != (payload === null || payload === void 0 ? void 0 : payload.model)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky Model is not Match!');
    }
    const result = yield rents_model_1.Rent.create(payload);
    return result;
});
// Get Single Rent
const getSingleRentIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rents_model_1.Rent.findById(id).populate("jet_skyId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
// Get All Rent
const getAllRentIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rents_model_1.Rent.find().populate("jet_skyId");
    //checking Rent is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
//Updated Rent
const updateRentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.jet_skyId) {
        const jet_sky = yield jet_model_1.JetSky.findById(payload === null || payload === void 0 ? void 0 : payload.jet_skyId);
        if (!jet_sky) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky is not Found!');
        }
    }
    const result = yield rents_model_1.Rent.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
// Delete Rent
const deleteRentIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rents_model_1.Rent.findByIdAndDelete(id);
    //checking Rent is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
exports.rentServices = {
    createRentIntoDB,
    getSingleRentIntoDB,
    getAllRentIntoDB,
    updateRentIntoDB,
    deleteRentIntoDB
};
