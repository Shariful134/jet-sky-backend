"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JetSky = void 0;
const mongoose_1 = require("mongoose");
const jetSkySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    hp: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });
exports.JetSky = (0, mongoose_1.model)('JetSky', jetSkySchema);
