import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { JetSky } from '../jet-sky/jet.model';
import { Booking, PurchaseAdventurePack } from './booking.Model';
import { User } from '../auth/auth.model';
import { IBooking } from './booking.Interface';
import { IPurchaseAdventurePackPayload, TJetSky, TUser } from '../../../types/types';
import { AdventurePack } from '../adventurePack/adventurePack.model';
import { Rent } from '../rents/rents.model';

// create BookingJets_Sky
const createBookingJetSkyIntoDB = async (
    payload: Partial<IBooking>,
    isAdmin: boolean = false
) => {

    // 0. User & Jet Ski Validation
    const userData = await User.findById(payload?.userId);
    const jetSkyData = await JetSky.findById(payload?.jetSkyId);

    if (!jetSkyData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
    }

    if (!userData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
    }

    // . limit 14 days without (Admin)
    const today = new Date();
    const startDate = new Date(payload.startDate as Date);

    const diffInDays = Math.ceil(
        (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (!isAdmin && diffInDays > 14) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            'You can only book up to 14 days in advance!'
        );
    }

    // 2. Availability check 
    const totalJetSkiesOfModel = await JetSky.countDocuments({ model: jetSkyData?.model });
    console.log(totalJetSkiesOfModel, "totalModel")
    const bookedCount = await Booking.countDocuments({
        bookingDate: payload.bookingDate,
        // status: 'active',
        jetSkyId: { $in: (await JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
    });

    if (bookedCount >= totalJetSkiesOfModel) {
        throw new AppError(
            StatusCodes.CONFLICT,
            `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`
        );
    }



    // 3. Credit Check
    if (userData?.purchesCredits) {
        if (!userData?.remainingCredits || userData?.remainingCredits < 1) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'You do not have enough credits to make this booking!'
            );
        }
        userData.remainingCredits -= 1;
        await userData.save();
    }


    const result = await Booking.create({
        ...payload,
        remainingCredits: userData.remainingCredits ?? userData.purchesCredits,
        purchesCredits: userData.purchesCredits ?? 0,
        // status: 'active',
        // paymentStatus: 'paid',
    });

    return result;
};


// purchaseAdventurePack
const purchasegAdventurePackIntoDB = async (
    payload: Partial<IPurchaseAdventurePackPayload>,

) => {

    const userData = await User.findById(payload?.userId);
    const adventurePackData = await AdventurePack.findById(payload?.adventurePackId)
    console.log("payload :", payload)
    console.log("adventurePackData :", adventurePackData)

    if (!adventurePackData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'adventurePack not found!');
    }

    if (!userData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
    }


    //create credit when user parches a adventurePack
    const result = await PurchaseAdventurePack.create({
        ...payload,
        purchesCredits: payload?.ridesNumber,
        remainingCredits: payload?.ridesNumber,
        status: 'inActive',
        paymentStatus: 'unpaid',
    });

    return result;
};

// purchaseAdventurePack
const purchasegRentPackIntoDB = async (
    payload: Partial<IBooking>,

) => {

    const userData = await User.findById(payload?.userId);
    const rentPackData = await Rent.findById(payload?.rentPackId)
    console.log("payload :", payload)
    console.log("adventurePackData :", rentPackData)

    if (!rentPackData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'RentPackId not found!');
    }

    if (!userData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
    }


    //create credit when user parches a adventurePack
    const result = await PurchaseAdventurePack.create({
        ...payload,
        purchesCredits: payload?.ridesNumber,
        remainingCredits: payload?.ridesNumber,
        status: 'inActive',
        paymentStatus: 'unpaid',
    });

    return result;
};

export const BookingServices = {
    createBookingJetSkyIntoDB,
    purchasegAdventurePackIntoDB,
    purchasegRentPackIntoDB
};
