import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, specialities, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  //"","medicine"

  if (specialities && specialities.length > 0) {
    andConditions.push({
      DoctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key: any) => ({
      [key]: { equals: filterData[key] },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.doctor.count({ where: whereConditions });
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { id } });

  const { specialities, ...doctorData } = payload;

  const updatedData = await prisma.$transaction(async (tx) => {
    if (specialities && specialities.length > 0) {
      const deleteSpecialityIds = specialities.filter(
        (speciality) => speciality.isDeleted
      );

      for (const speciality of deleteSpecialityIds) {
        await tx.doctorSpecialities.deleteMany({
          where: { doctorId: id, specialitiesId: speciality.specialityId },
        });
      }

      const createSpecialityIds = specialities.filter(
        (speciality) => !speciality.isDeleted
      );

      for (const speciality of createSpecialityIds) {
        await tx.doctorSpecialities.create({
          data: { doctorId: id, specialitiesId: speciality.specialityId },
        });
      }
    }

    return await tx.doctor.update({
      where: { id: doctor.id },
      data: doctorData,
      include: {
        DoctorSpecialities: {
          include: {
            specialities: true,
          },
        },
      },
    });
  });

  return updatedData;
};

export const doctorService = {
  getAllFromDB,
  updateIntoDB,
};
