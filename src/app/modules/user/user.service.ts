import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import { paginationHelper } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constant";

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

  async getAllUsers(filters: any, options: any) {
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
      andConditions.push({
        OR: userSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      });
    }

    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: (filterData as any)[key],
          },
        })),
      });
    }

    const whereConditions: Prisma.UserWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
      where: whereConditions,
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const total = await prisma.user.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
      data: result,
    };
  }
}
