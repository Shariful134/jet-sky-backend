import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdventurePackServices } from './adventure.Services';


//create AdventurePack
const createAdventurePack= catchAsync(async (req, res) => {
const { body } = req;

  const result = await AdventurePackServices.createAdventurePackIntoDB(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AdventurePack Created Successfully',
    data: [result],
  });
  
});


//getSingle AdventurePack
const getSingleAdventurePack = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdventurePackServices.getSingleAdventurePackIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AdventurePack Retrived Successfully',
    data: [result],
  });
});

//getAll AdventurePack
const getAllAdventurePack = catchAsync(async (req, res) => {
  const result = await AdventurePackServices.getAllAdventurePackIntoDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AdventurePacks are Retrived Successfully',
    data: result,
  });
});

//delete AdventurePack
const deleteAdventurePack = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdventurePackServices.deleteAdventurePackIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AdventurePack Deleted Successfully',
    data: result,
  });
});

//updated AdventurePack
const updateAdventurePack = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdventurePackServices.updateAdventurePackIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'AdventurePack Updated Successfully',
    data: result,
  });
});


export const adventurePackControllers = {
   createAdventurePack,
   getSingleAdventurePack,
   getAllAdventurePack,
   updateAdventurePack,
   deleteAdventurePack,

};



