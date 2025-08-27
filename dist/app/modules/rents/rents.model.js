"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rent = void 0;
const mongoose_1 = require("mongoose");
const rentSchema = new mongoose_1.Schema({
    jet_skyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JetSky",
        required: true,
    },
    model: { type: String, required: true },
    hp: { type: Number, required: true },
    price: { type: Number, required: true },
    feature_list: { type: [String], default: [] }
}, { timestamps: true });
exports.Rent = (0, mongoose_1.model)('Rent', rentSchema);
