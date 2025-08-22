import { NextFunction, Request, Response } from "express";

import fs from "fs";
import cloudinary from "./cloudinary";

const attachFileToBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      // Cloudinary তে upload করা
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "jetsky",
      });

      // Database এ এই URL save হবে
      req.body.image = result.secure_url;

      // লোকাল ফাইল ডিলিট করে দিচ্ছি (কারণ আর দরকার নেই)
      fs.unlinkSync(req.file.path);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default attachFileToBody;
