import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { memberShipServices } from './memberShip.services';


//create
const createMemberShip = catchAsync(async (req, res) => {
const { body } = req;

  const result = await memberShipServices.createMemberShiipIntoDB(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'MemberShip Created Successfully',
    data: [result],
  });
  
});


//getSingle MemberShip
const getSingleMemberShip = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await memberShipServices.getSingleMemberShipIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'MemberShip Retrived Successfully',
    data: [result],
  });
});

//getAll MemberShip
const getAllMemberShip= catchAsync(async (req, res) => {
  const result = await memberShipServices.getAllMemberShipIntoDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'MemberShip are Retrived Successfully',
    data: result,
  });
});

//delete MemberShip
const deleteMemberShip = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await memberShipServices.deleteMemberShipIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'MemberShip Deleted Successfully',
    data: result,
  });
});

//updated Membership
const updateMemberShip = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await memberShipServices.updateMemberShipIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'MemberShip Updated Successfully',
    data: result,
  });
});


export const memberShipControllers = {
    createMemberShip,
    getSingleMemberShip,
    getAllMemberShip,
    updateMemberShip,
    deleteMemberShip

};



