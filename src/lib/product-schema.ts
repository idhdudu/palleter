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
  saleOptionsText: z.string().trim().max(4000).optional().or(z.literal("")),
  pricingTiersText: z.string().trim().max(4000).optional().or(z.literal("")),
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

export function parseSaleOptionsText(text: string | null | undefined) {
  const source = text?.trim();
  if (!source) return [];

  return source.split("\n").flatMap((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 3) {
      throw new Error(
        `Linea ${index + 1}: usa el formato cantidad|unidad|precio`,
      );
    }

    const quantity = Number(parts[0]);
    const unit = parts[1];
    const priceCents = Number(parts[2]);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Linea ${index + 1}: la cantidad debe ser mayor que 0`);
    }

    if (!["KG", "G", "L", "ML", "UNIT"].includes(unit)) {
      throw new Error(
        `Linea ${index + 1}: la unidad debe ser KG, G, L, ML o UNIT`,
      );
    }

    if (!Number.isInteger(priceCents) || priceCents < 0) {
      throw new Error(
        `Linea ${index + 1}: el precio debe ser un entero en centimos`,
      );
    }

    return {
      quantity,
      unit,
      priceCents,
      label:
        unit === "UNIT"
          ? `${quantity} unidad${quantity === 1 ? "" : "es"}`
          : `${quantity} ${unit.toLowerCase()}`,
    };
  });
}

export function parsePricingTiersText(text: string | null | undefined) {
  const source = text?.trim();
  if (!source) return [];

  return source.split("\n").flatMap((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 4) {
      throw new Error(
        `Linea ${index + 1}: usa el formato minimo|maximo|unidad|precio`,
      );
    }

    const minQuantity = Number(parts[0]);
    const maxQuantity = Number(parts[1]);
    const unit = parts[2];
    const pricePerUnitCents = Number(parts[3]);

    if (!Number.isFinite(minQuantity) || minQuantity < 0) {
      throw new Error(`Linea ${index + 1}: el minimo debe ser valido`);
    }

    if (!Number.isFinite(maxQuantity) || maxQuantity <= minQuantity) {
      throw new Error(`Linea ${index + 1}: el maximo debe ser mayor que el minimo`);
    }

    if (!["KG", "G", "L", "ML", "UNIT"].includes(unit)) {
      throw new Error(
        `Linea ${index + 1}: la unidad debe ser KG, G, L, ML o UNIT`,
      );
    }

    if (!Number.isInteger(pricePerUnitCents) || pricePerUnitCents < 0) {
      throw new Error(
        `Linea ${index + 1}: el precio por unidad debe ser un entero en centimos`,
      );
    }

    return {
      minQuantity,
      maxQuantity,
      unit,
      pricePerUnitCents,
      label: `${minQuantity}-${maxQuantity} ${unit.toLowerCase()} @ ${pricePerUnitCents}c`,
    };
  });
}

export function formatSaleOptionsText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((option) => {
      if (
        typeof option === "object" &&
        option !== null &&
        "quantity" in option &&
        "unit" in option &&
        "priceCents" in option
      ) {
        const typed = option as {
          quantity: number;
          unit: string;
          priceCents: number;
        };
        return `${typed.quantity}|${typed.unit}|${typed.priceCents}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}

export function formatPricingTiersText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((option) => {
      if (
        typeof option === "object" &&
        option !== null &&
        "minQuantity" in option &&
        "maxQuantity" in option &&
        "unit" in option &&
        "pricePerUnitCents" in option
      ) {
        const typed = option as {
          minQuantity: number;
          maxQuantity: number;
          unit: string;
          pricePerUnitCents: number;
        };
        return `${typed.minQuantity}|${typed.maxQuantity}|${typed.unit}|${typed.pricePerUnitCents}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n");
}
