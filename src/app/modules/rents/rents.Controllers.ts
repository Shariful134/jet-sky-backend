import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { rentServices } from './rents.Services';




//create Rent
const createRent = catchAsync(async (req, res) => {
    const { body } = req;

    const result = await rentServices.createRentIntoDB(body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rent Created Successfully',
        data: [result],
    });

});


//getSingle Rent
const getSingleRent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await rentServices.getSingleRentIntoDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rent Retrived Successfully',
        data: [result],
    });
});

//getAll Rent
const getAllRent = catchAsync(async (req, res) => {
    const result = await rentServices.getAllRentIntoDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rent are Retrived Successfully',
        data: result,
    });
});

//delete Rent
const deleteRent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await rentServices.deleteRentIntoDB(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rent Deleted Successfully',
        data: result,
    });
});

//updated Rent
const updateRent = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await rentServices.updateRentIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Rent Updated Successfully',
        data: result,
    });
});


export const rentControllers = {
    createRent,
    getSingleRent,
    getAllRent,
    updateRent,
    deleteRent,

};



