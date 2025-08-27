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
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
const attachFileToBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            if (process.env.NODE_ENV === "production") {
                const result = yield cloudinary_1.default.uploader.upload(req.file.path, {
                    folder: "jetsky",
                });
                req.body.image = result.secure_url;
                fs_1.default.unlinkSync(req.file.path);
            }
            else {
                req.body.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = attachFileToBody;
