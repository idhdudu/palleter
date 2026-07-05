import { OrderDeliveryType, OrderStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? new Date(value) : null))
  .refine((value) => value === null || !Number.isNaN(value.getTime()), {
    message: "Fecha invalida",
  });

export const orderFormSchema = z
  .object({
    productId: z.string().min(1),
    customerName: z.string().trim().min(2).max(120),
    customerEmail: z.string().email().optional().or(z.literal("")),
    customerPhone: z.string().trim().max(40).optional().or(z.literal("")),
    quantity: z.coerce.number().int().positive().default(1),
    deliveryType: z.nativeEnum(OrderDeliveryType).default(OrderDeliveryType.PICKUP),
    status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
    pickupAt: optionalDate,
    deliveryTown: z.string().trim().max(120).optional().or(z.literal("")),
    deliveryAddress: z.string().trim().max(240).optional().or(z.literal("")),
    customerNotes: z.string().trim().max(1000).optional().or(z.literal("")),
    internalNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .transform((data) => ({
    ...data,
    customerEmail: data.customerEmail || null,
    customerPhone: data.customerPhone || null,
    deliveryTown: data.deliveryTown || null,
    deliveryAddress: data.deliveryAddress || null,
    customerNotes: data.customerNotes || null,
    internalNotes: data.internalNotes || null,
  }));

export type OrderFormValues = z.infer<typeof orderFormSchema>;
