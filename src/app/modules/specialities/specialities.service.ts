import { Request } from "express";

import { Specialities } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";

const inserIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialities.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (): Promise<Specialities[]> => {
  return await prisma.specialities.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialities> => {
  const result = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialitiesService = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
