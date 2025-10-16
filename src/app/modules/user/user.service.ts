import bcrypt from "bcryptjs";
import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";

export class UserService {
  //create patient
  async createPatient(req: Request) {
    if (req.file) {
      const uploadResult = await fileUploader.uploadToCloudinary(req.file);

      req.body.patient.profilePhoto = uploadResult?.secure_url;
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      config.pass_salt_round
    );

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: req.body.patient.email,
          password: hashedPassword,
        },
      });

      return await tx.patient.create({
        data: req.body.patient,
      });
    });

    return result;
  }

  //create doctor

  async createDoctor(req: Request) {
    if (req.file) {
      const uploadResult = await fileUploader.uploadToCloudinary(req.file);
      req.body.doctor.profilePhoto = uploadResult?.secure_url;
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      config.pass_salt_round
    );

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: req.body.doctor.email,
          role: req.body.role,
          password: hashedPassword,
        },
      });

      return await tx.doctor.create({ data: req.body.doctor });
    });

    return result;
  }

  //create admin

  async createAdmin(req: Request) {
    if (req.file) {
      const uploadResult = await fileUploader.uploadToCloudinary(req.file);
      req.body.admin.profilePhoto = uploadResult?.secure_url;
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      config.pass_salt_round
    );

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email: req.body.admin.email,
          role: req.body.role,
          password: hashedPassword,
        },
      });

      return await tx.admin.create({ data: req.body.admin });
    });
    return result;
  }

  async getAllUsers({
    page,
    limit,
    sortBy,
    sortOrder,
    searchTerm,
  }: {
    page: number;
    limit: number;
    sortBy: any;
    sortOrder: any;
    searchTerm?: string;
  }) {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const result = await prisma.user.findMany({
      where: {
        email: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      take: limitNumber,
      skip,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    });
    return result;
  }
}
