import { StatusCodes } from 'http-status-codes';

import AppError from '../../../errors/AppError';



import { IJetSky } from './jet.interface';
import { JetSky } from './jet.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../auth/auth.model';
import { jetSearchableFields } from './jet.constant';


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

// const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
//   const facultyQuery = new QueryBuilder(
//     Faculty.find().populate('academicDepartment'),
//     query,
//   )
//     .search(FacultySearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await facultyQuery.modelQuery;
//   return result;
// };

// Get All Jet
const getAllJetIntoDB = async (query: Record<string, unknown>) => {

  const jet_SkyQuery =  new QueryBuilder(
    JetSky.find(), query
  ).search(jetSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = jet_SkyQuery.modelQuery;
  
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
