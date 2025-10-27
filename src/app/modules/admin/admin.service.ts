import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { adminSearchableFields } from "./patient.constant";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.admin.count({ where: whereConditions });
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateIntoDB = async (id: string, payload: Prisma.AdminUpdateInput) => {
  const admin = await prisma.admin.findUniqueOrThrow({ where: { id } });

  const updatedData = await prisma.admin.update({
    where: { id },
    data: payload,
  });

  return updatedData;
};

export const adminService = {
  getAllFromDB,
  updateIntoDB,
};
