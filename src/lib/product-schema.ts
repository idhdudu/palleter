import { DeliveryMode, Role, ProductCategory } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? new Date(value) : null))
  .refine((value) => value === null || !Number.isNaN(value.getTime()), {
    message: "Fecha invalida",
  });

const deliveryTownsSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) =>
    value
      ? value
          .split(/[\n,]/)
          .map((town) => town.trim())
          .filter(Boolean)
      : [],
  );

export const productFormSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalido"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  category: z.nativeEnum(ProductCategory),
  minWeightKg: z.coerce.number().positive(),
  maxWeightKg: z.coerce.number().positive(),
  priceCents: z.coerce.number().int().nonnegative(),
  shippingCents: z.coerce.number().int().nonnegative().default(0),
  zone: z.string().trim().min(2).max(120),
  deliveryMode: z.nativeEnum(DeliveryMode).default(DeliveryMode.NONE),
  deliveryRadiusKm: z.coerce.number().int().positive().optional().or(z.literal("")),
  deliveryTowns: deliveryTownsSchema,
  deliveryAvailableFrom: optionalDate,
  deliveryAvailableTo: optionalDate,
  localPickup: z.coerce.boolean().default(true),
  pickupNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  deliveryNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  public: z.coerce.boolean().default(true),
  availabilityStartsAt: optionalDate,
  availabilityEndsAt: optionalDate,
});

export const registerFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  role: z.nativeEnum(Role).default(Role.AGRICULTOR),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
