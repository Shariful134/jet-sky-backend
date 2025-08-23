import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { IAdventurePack } from './adventurePack.interface';
import { AdventurePack } from './adventurePack.model';



// create AdventurePack
const createAdventurePackIntoDB = async (payload: IAdventurePack) => {
  const result = await AdventurePack.create(payload);
  return result
};


// Get Single AdventurePack
const getSingleAdventurePackIntoDB = async (id: string) => {
  const result = await AdventurePack.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
  }
  return result;
};

// Get All AdventurePack
const getAllAdventurePackIntoDB = async () => {
  const result = await AdventurePack.find();
  
  //checking AdventurePack is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
  }
  return result;
};




//Updated AdventurePack
const updateAdventurePackIntoDB = async (id: string, payload: Partial<IAdventurePack>) => {
  const result = await AdventurePack.findByIdAndUpdate(id, payload, { new: true });
if (!result) {
  throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
}
return result;
};


// Delete AdventurePack
const deleteAdventurePackIntoDB = async (id: string) => {
  const result = await AdventurePack.findByIdAndDelete(id);

  //checking AdventurePack is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
  }
  return result;
};
export const AdventurePackServices = {
createAdventurePackIntoDB,
getSingleAdventurePackIntoDB,
getAllAdventurePackIntoDB,
updateAdventurePackIntoDB,
deleteAdventurePackIntoDB,

};
