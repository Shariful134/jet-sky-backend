import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { jetServices } from './jet.services';

//create
const createJet = catchAsync(async (req, res) => {
const { body, file } = req;
console.log(body)

  if (file) {
    body.image = `/uploads/${file.filename}`;
  }

  const result = await jetServices.createJetIntoDB(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jet Created Successfully',
    data: [result],
  });
});


//getSingle Jet
const getSingleJet = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await jetServices.getSingleJetIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jet Retrived Successfully',
    data: [result],
  });
});

//getAll Jet
const getAllJet = catchAsync(async (req, res) => {
  const result = await jetServices.getAllJetIntoDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jet are Retrived Successfully',
    data: result,
  });
});

//delete Jet
const deleteJet = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await jetServices.deleteJetIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jet Deleted Successfully',
    data: result,
  });
});

//updated Jet
const updateJet = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await jetServices.updateJetIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Jet Updated Successfully',
    data: result,
  });
});


export const jetControllers = {
    createJet,
    getSingleJet,
    getAllJet,
    updateJet,
    deleteJet

};



