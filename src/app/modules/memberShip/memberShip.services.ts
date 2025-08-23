import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IMemberShip } from './memberShip.interface';
import { MemberShip } from './memberShip.model';


// create memberShip
const createMemberShiipIntoDB = async (payload: IMemberShip) => {
  const result = await MemberShip.create(payload);
  return result
};


// Get Single memberShip
const getSingleMemberShipIntoDB = async (id: string) => {
  const result = await MemberShip.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
  }
  return result;
};

// Get All memberShip
const getAllMemberShipIntoDB = async () => {
  const result = await MemberShip.find();
  
  //checking memberShip is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
  }
  return result;
};


//Updated MemberShip
const updateMemberShipIntoDB = async (id: string, payload: Partial<IMemberShip>) => {
  const result = await MemberShip.findByIdAndUpdate(id, payload, { new: true });
if (!result) {
  throw new AppError(StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
}
return result;
};


// Delete MemberShip
const deleteMemberShipIntoDB = async (id: string) => {
  const result = await MemberShip.findByIdAndDelete(id);

  //checking membership is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
  }
  return result;
};
export const memberShipServices = {
createMemberShiipIntoDB,
getSingleMemberShipIntoDB,
getAllMemberShipIntoDB,
updateMemberShipIntoDB,
deleteMemberShipIntoDB

};
