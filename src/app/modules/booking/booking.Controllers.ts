import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookingServices } from "./booking.Services";
import { IBooking } from "./booking.Interface";


//create JetSky
const createBookingJetSky = catchAsync(async (req, res) => {
    const payload: Partial<IBooking> = req.body;


    // if usre is admin then no limit of days
    const isAdmin = req.user?.role === "Admin";

    const result = await BookingServices.createBookingJetSkyIntoDB(payload, isAdmin);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'JetSky Booking Successfully',
        data: [result],
    });

});


//create AdventurePack
const purchaseAdventurePack = catchAsync(async (req, res) => {
    const payload= req.body;
    console.log(payload)
    const result = await BookingServices.purchasegAdventurePackIntoDB(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'AdventurePack Purchase Successfully',
        data: [result],
    });

});

export const BookingContnrollers = {
    createBookingJetSky,
    purchaseAdventurePack
}