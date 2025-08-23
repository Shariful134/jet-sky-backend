import { StatusCodes } from 'http-status-codes';

import AppError from '../../../errors/AppError';



import { IJetSky } from './jet.interface';
import { JetSky } from './jet.model';


// create Jet
const createJetIntoDB = async (payload: IJetSky) => {
  const result = await JetSky.create(payload);
  return result
};


// Get Single Jet
const getSingleJetIntoDB = async (id: string) => {
  const result = await JetSky.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Jet is not Found!');
  }
  return result;
};

// Get All Jet
const getAllJetIntoDB = async () => {
  const result = await JetSky.find();
  
  //checking jet is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Jet is not Found!');
  }
  return result;
};




//Updated Jet
const updateJetIntoDB = async (id: string, payload: Partial<IJetSky>) => {
  const result = await JetSky.findByIdAndUpdate(id, payload, { new: true });
if (!result) {
  throw new AppError(StatusCodes.BAD_REQUEST, 'Jet is not Found!');
}
return result;
};


// Delete Jet
const deleteJetIntoDB = async (id: string) => {
  const result = await JetSky.findByIdAndDelete(id);

  //checking user is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Jet is not Found!');
  }
  return result;
};
export const jetServices = {

createJetIntoDB,
getSingleJetIntoDB,
getAllJetIntoDB,
updateJetIntoDB,
deleteJetIntoDB
};
