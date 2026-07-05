import { DeliveryMode, ProductCategory } from "@prisma/client";

export const categoryLabels: Record<ProductCategory, string> = {
  HORTALIZAS: "Hortalizas",
  FRUTAS: "Frutas",
  VERDURAS: "Verduras",
  ACEITES: "Aceites",
  MIEL: "Miel",
};

export const deliveryModeLabels: Record<DeliveryMode, string> = {
  NONE: "Sin reparto",
  RADIUS: "Por radio",
  TOWNS: "Por poblaciones",
  BOTH: "Radio y poblaciones",
};

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDecimal(value: unknown) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return "0";
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
  }).format(numeric);
}

function normalizeUnit(unit: unknown) {
  if (typeof unit !== "string") return "";

  switch (unit) {
    case "KG":
      return "kg";
    case "G":
      return "g";
    case "L":
      return "l";
    case "ML":
      return "ml";
    case "UNIT":
      return "ud";
    default:
      return unit.toLowerCase();
  }
}

export function summarizeSaleOptions(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((option) => {
    if (
      typeof option !== "object" ||
      option === null ||
      !("quantity" in option) ||
      !("unit" in option) ||
      !("priceCents" in option)
    ) {
      return [];
    }

    const typed = option as {
      quantity: number;
      unit: string;
      priceCents: number;
    };

    return `${formatDecimal(typed.quantity)} ${normalizeUnit(typed.unit)} · ${formatMoney(
      typed.priceCents,
    )}`;
  });
}

export function summarizePricingTiers(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((option) => {
    if (
      typeof option !== "object" ||
      option === null ||
      !("minQuantity" in option) ||
      !("maxQuantity" in option) ||
      !("unit" in option) ||
      !("pricePerUnitCents" in option)
    ) {
      return [];
    }

    const typed = option as {
      minQuantity: number;
      maxQuantity: number;
      unit: string;
      pricePerUnitCents: number;
    };

    return `${formatDecimal(typed.minQuantity)}-${formatDecimal(typed.maxQuantity)} ${normalizeUnit(
      typed.unit,
    )} · ${formatMoney(typed.pricePerUnitCents)} / unidad`;
  });
}

export function extractImageUrls(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
  );
}

export function getPrimaryImageUrl(value: unknown) {
  return extractImageUrls(value)[0] ?? null;
}
