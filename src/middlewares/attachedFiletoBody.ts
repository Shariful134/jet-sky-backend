import { NextFunction, Request, Response } from "express";

const attachFileToBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
       req.body.image = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

    }
    next();
  } catch (error) {
    next(error);
  }
};

export default attachFileToBody;
