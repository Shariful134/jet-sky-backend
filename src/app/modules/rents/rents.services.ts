import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IRent } from './rents.interface';
import { Rent } from './rents.model';



// create Rent
const createRentIntoDB = async (payload: IRent) => {
  const result = await Rent.create(payload);
  return result
};


// Get Single Rent
const getSingleRentIntoDB = async (id: string) => {
  const result = await Rent.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Rent is not Found!');
  }
  return result;
};

// Get All Rent
const getAllRentIntoDB = async () => {
  const result = await Rent.find();
  
  //checking Rent is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Rent is not Found!');
  }
  return result;
};




//Updated Rent
const updateRentIntoDB = async (id: string, payload: Partial<IRent>) => {
  const result = await Rent.findByIdAndUpdate(id, payload, { new: true });
if (!result) {
  throw new AppError(StatusCodes.BAD_REQUEST, 'Rent is not Found!');
}
return result;
};


// Delete Rent
const deleteRentIntoDB = async (id: string) => {
  const result = await Rent.findByIdAndDelete(id);

  //checking Rent is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Rent is not Found!');
  }
  return result;
};
export const jetServices = {


};
