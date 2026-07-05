"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  parsePricingTiersText,
  parseSaleOptionsText,
  productFormSchema,
} from "@/lib/product-schema";
import { requireFarmerOrAdmin } from "@/lib/authorization";

async function ensureEditableProduct(productId: string, userId: string, role: Role) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, ownerId: true },
  });

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  if (role !== Role.ADMIN && product.ownerId !== userId) {
    throw new Error("No tienes permiso para modificar este producto");
  }

  return product;
}

function normalizeOptionalNumber(value: number | string | null | undefined) {
  if (value === "" || value === null || value === undefined) return null;
  return typeof value === "number" ? value : Number(value);
}

function resolveDeliveryFields(data: {
  deliveryMode: string;
  deliveryRadiusKm?: number | string | null | undefined;
  deliveryTowns: string[];
  deliveryAvailableFrom: Date | null;
  deliveryAvailableTo: Date | null;
}) {
  const deliveryRadiusKm = normalizeOptionalNumber(data.deliveryRadiusKm);
  const wantsRadius =
    data.deliveryMode === "RADIUS" || data.deliveryMode === "BOTH";
  const wantsTowns =
    data.deliveryMode === "TOWNS" || data.deliveryMode === "BOTH";

  return {
    deliveryRadiusKm: wantsRadius ? deliveryRadiusKm : null,
    deliveryTowns: wantsTowns ? data.deliveryTowns : [],
    deliveryAvailableFrom: data.deliveryMode === "NONE" ? null : data.deliveryAvailableFrom,
    deliveryAvailableTo: data.deliveryMode === "NONE" ? null : data.deliveryAvailableTo,
  };
}

function resolveSaleOptions(text: string | null | undefined) {
  try {
    return parseSaleOptionsText(text);
  } catch (error) {
    return error instanceof Error ? error : new Error("Formato de medidas invalido");
  }
}

function resolvePricingTiers(text: string | null | undefined) {
  try {
    return parsePricingTiersText(text);
  } catch (error) {
    return error instanceof Error ? error : new Error("Formato de tramos invalido");
  }
}

export type ProductActionState = {
  error?: string;
};

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await requireFarmerOrAdmin();
  const parsed = productFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: "Revisa los datos del producto." };
  }

  const data = parsed.data;
  const deliveryFields = resolveDeliveryFields(data);
  const saleOptions = resolveSaleOptions(data.saleOptionsText);
  const pricingTiers = resolvePricingTiers(data.pricingTiersText);

  if (saleOptions instanceof Error) {
    return { error: saleOptions.message };
  }
  if (pricingTiers instanceof Error) {
    return { error: pricingTiers.message };
  }

  await prisma.product.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      category: data.category,
      minWeightKg: new Prisma.Decimal(data.minWeightKg),
      maxWeightKg: new Prisma.Decimal(data.maxWeightKg),
      priceCents: data.priceCents,
      shippingCents: data.shippingCents,
      zone: data.zone,
      deliveryMode: data.deliveryMode,
      ...deliveryFields,
      localPickup: data.localPickup,
      pickupNotes: data.pickupNotes || null,
      deliveryNotes: data.deliveryNotes || null,
      saleOptions: saleOptions.length ? saleOptions : Prisma.DbNull,
      pricingTiers: pricingTiers.length ? pricingTiers : Prisma.DbNull,
      public: data.public,
      ownerId: session.user.id,
      availability: data.availabilityStartsAt && data.availabilityEndsAt
        ? {
            create: {
              startsAt: data.availabilityStartsAt,
              endsAt: data.availabilityEndsAt,
            },
          }
        : undefined,
    },
  });

  revalidatePath("/panel");
  redirect("/panel?created=1");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const session = await requireFarmerOrAdmin();
  await ensureEditableProduct(productId, session.user.id, session.user.role);
  const parsed = productFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: "Revisa los datos del producto." };
  }

  const data = parsed.data;
  const deliveryFields = resolveDeliveryFields(data);
  const saleOptions = resolveSaleOptions(data.saleOptionsText);
  const pricingTiers = resolvePricingTiers(data.pricingTiersText);

  if (saleOptions instanceof Error) {
    return { error: saleOptions.message };
  }
  if (pricingTiers instanceof Error) {
    return { error: pricingTiers.message };
  }

  await prisma.$transaction(async (tx) => {
    await tx.productAvailability.deleteMany({ where: { productId } });
    await tx.product.update({
      where: { id: productId },
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description || null,
        category: data.category,
        minWeightKg: new Prisma.Decimal(data.minWeightKg),
        maxWeightKg: new Prisma.Decimal(data.maxWeightKg),
        priceCents: data.priceCents,
        shippingCents: data.shippingCents,
        zone: data.zone,
        deliveryMode: data.deliveryMode,
        ...deliveryFields,
        localPickup: data.localPickup,
        pickupNotes: data.pickupNotes || null,
        deliveryNotes: data.deliveryNotes || null,
        saleOptions: saleOptions.length ? saleOptions : Prisma.DbNull,
        pricingTiers: pricingTiers.length ? pricingTiers : Prisma.DbNull,
        public: data.public,
        availability:
          data.availabilityStartsAt && data.availabilityEndsAt
            ? {
                create: {
                  startsAt: data.availabilityStartsAt,
                  endsAt: data.availabilityEndsAt,
                },
              }
            : undefined,
      },
    });
  });

  revalidatePath("/panel");
  revalidatePath(`/panel/productos/${productId}/editar`);
  redirect("/panel?updated=1");
}

export async function deleteProductAction(productId: string) {
  const session = await requireFarmerOrAdmin();
  await ensureEditableProduct(productId, session.user.id, session.user.role);

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/panel");
  redirect("/panel?deleted=1");
}
