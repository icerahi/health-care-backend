import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { patientSearchableFields } from "./patient.constant";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: { equals: filterData[key] },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.patient.count({ where: whereConditions });
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateIntoDB = async (id: string, payload: Prisma.PatientUpdateInput) => {
  const patient = await prisma.patient.findUniqueOrThrow({ where: { id } });

  const updatedData = await prisma.patient.update({
    where: { id },
    data: payload,
  });

  return updatedData;
};

export const patientService = {
  getAllFromDB,
  updateIntoDB,
};
