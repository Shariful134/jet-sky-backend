"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingAdventurePack = void 0;
const mongoose_1 = require("mongoose");
const bookingAdventurePackSchema = new mongoose_1.Schema({
    adventurePackId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AdventurePack",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    ridesNumber: {
        type: Number,
        required: true,
    },
    ridesPricing: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    expireDate: {
        type: Date,
        required: true,
    },
    rideComplete: {
        type: Number,
        default: 0,
    },
    rideRemaining: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// BookingAdventurePack Model
exports.BookingAdventurePack = (0, mongoose_1.model)("BookingAdventurePack", bookingAdventurePackSchema);
