import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    OR: doctorSearchableFields.map((field) => ({
      [field]: { contains: searchTerm, mode: "insensitive" },
    }));
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key: any) => ({
      [key]: { equal: filterData[key] },
    }));

    andConditions.push(...filterConditions);
  }
};

export const doctorService = {
  getAllFromDB,
};
