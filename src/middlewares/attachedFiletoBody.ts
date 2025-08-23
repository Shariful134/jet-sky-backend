import { NextFunction, Request, Response } from "express";

import fs from "fs";
import cloudinary from "./cloudinary";

const attachFileToBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      if (process.env.NODE_ENV === "production") {
        // Production এ Cloudinary তে upload করবো
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "jetsky",
        });

        req.body.image = result.secure_url;

        // লোকাল ফাইল ডিলিট করে দিচ্ছি
        fs.unlinkSync(req.file.path);
      } else {
        // লোকালি full URL generate করবো
        req.body.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default attachFileToBody;
