import { Gender, UserRole } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.email().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  role: z.enum(UserRole),
  doctor: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.email().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
    address: z.string().optional(),
    registrationNumber: z.string().nonempty("Registration number is required"),
    experience: z.number().min(0),
    gender: z.enum(Gender),
    appointmentFee: z.number().min(0),
    qualification: z.string().nonempty("Qualification is required"),
    currentWorkingPlace: z
      .string()
      .nonempty("Current Working Place is required"),
    designation: z.string().nonempty("Designation is required"),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string(),
  role: z.enum(UserRole),
  admin: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.email().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
  }),
});

export const userValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
