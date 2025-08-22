import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { authServices } from './auth.services';
import config from '../../../config';


//register User
const registerAdmin = catchAsync(async (req, res) => {
  const result = await authServices.registerAdminIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration Successfully',
    data: [result],
  });
});

//register User
const registerAdministrator = catchAsync(async (req, res) => {
  const result = await authServices.registerAdministratorIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration Successfully',
    data: [result],
  });
});

//register User
const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.registerUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Registration Successfully',
    data: [result],
  });
});

//login User
const loginUser = catchAsync(async (req, res, next) => {
  const result = await authServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login Successfully!',
    data: [accessToken],
  });
});



//getSingle User
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authServices.getSingleUserIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Retrived Successfully',
    data: [result],
  });
});

//getAll User
const getAllUser = catchAsync(async (req, res) => {
  const result = await authServices.getAllUserIntoDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All User Retrived Successfully',
    data: result,
  });
});

//getAll Administrator
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await authServices.deleteUserIntoDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Deleted Successfully',
    data: result,
  });
});

//updated User
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await authServices.updateUserIntoDB(id, req.body, req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User updated Successfully',
    data: result,
  });
});


// //getSingle Administrator
// const getSingleAdministrator = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const result = await authServices.getSingleAdministratorIntoDB(email);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Administrator Retrived Successfully',
//     data: [result],
//   });
// });

// //getAll Trainer
// const getAllAdministrator = catchAsync(async (req, res) => {
//   const result = await authServices.getAllAdministratorIntoDB();
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'All Administrators Retrived Successfully',
//     data: result,
//   });
// });


// //getAll Administrator
// const deleteAdministrator = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const result = await authServices.deleteAdministratorIntoDB(email);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Administrator Deleted Successfully',
//     data: result,
//   });
// });



export const authControllers = {
  registerAdmin,
  registerAdministrator,
  registerUser,
  loginUser,
  getSingleUser,
  getAllUser,
  // getSingleAdministrator,
  // getAllAdministrator,
  deleteUser,
  // deleteAdministrator,
  updateUser
};



