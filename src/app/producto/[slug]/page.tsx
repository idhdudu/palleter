/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  categoryLabels,
  extractImageUrls,
  deliveryModeLabels,
  formatDecimal,
  formatMoney,
  getPrimaryImageUrl,
  summarizePricingTiers,
  summarizeSaleOptions,
} from "@/lib/public-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, public: true },
    select: { title: true, description: true, zone: true },
  });

  if (!product) {
    return {
      title: "Producto no encontrado | Palleter",
    };
  }

  return {
    title: `${product.title} | Palleter`,
    description:
      product.description ||
      `Ficha pública de ${product.title} en ${product.zone}, con precio, reparto y disponibilidad.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, public: true },
    include: {
      owner: { select: { name: true } },
      availability: { orderBy: { startsAt: "asc" } },
      contacts: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!product) notFound();

  const saleOptions = summarizeSaleOptions(product.saleOptions);
  const pricingTiers = summarizePricingTiers(product.pricingTiers);
  const imageUrls = extractImageUrls(product.images);
  const primaryImage = getPrimaryImageUrl(product.images);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-10 lg:px-12">
      <Link
        href="/"
        className="inline-flex rounded-full border border-[var(--panel-border)] bg-white/65 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
      >
        Volver al catálogo
      </Link>

      <article className="mt-5 rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              {categoryLabels[product.category]}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {product.description ||
                "Producto local con información clara de peso, precio y reparto."}
            </p>
          </div>

          <div className="rounded-full bg-[rgba(53,84,43,0.10)] px-5 py-3 text-sm font-semibold text-[var(--accent-strong)]">
            {formatMoney(product.priceCents)}
          </div>
        </div>

        {primaryImage ? (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/5 bg-[rgba(95,124,73,0.08)]">
            <img
              src={primaryImage}
              alt={product.title}
              className="h-80 w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Peso
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatDecimal(product.minWeightKg)} -{" "}
              {formatDecimal(product.maxWeightKg)} kg
            </p>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Envio
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatMoney(product.shippingCents)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Reparto
            </p>
            <p className="mt-1 text-sm font-medium">
              {deliveryModeLabels[product.deliveryMode]}
            </p>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Recogida
            </p>
            <p className="mt-1 text-sm font-medium">
              {product.localPickup ? "Disponible" : "No disponible"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Formatos de venta</h2>
            {saleOptions.length ? (
              <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                {saleOptions.map((item) => (
                  <li key={item} className="rounded-2xl bg-white px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">
                El agricultor todavía no ha definido formatos concretos.
              </p>
            )}
          </section>

          <section className="rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Tramos de precio</h2>
            {pricingTiers.length ? (
              <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
                {pricingTiers.map((item) => (
                  <li key={item} className="rounded-2xl bg-white px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Todavía no hay precios por tramos definidos.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Reparto y zona</h2>
            <div className="mt-3 grid gap-3 text-sm text-[var(--muted)]">
              <p>
                Zona: <span className="font-medium text-[var(--foreground)]">{product.zone}</span>
              </p>
              <p>
                Radio:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {product.deliveryRadiusKm
                    ? `${product.deliveryRadiusKm} km`
                    : "No definido"}
                </span>
              </p>
              <p>
                Poblaciones:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {product.deliveryTowns.length
                    ? product.deliveryTowns.join(", ")
                    : "No definidas"}
                </span>
              </p>
              <p>
                Inicio reparto:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {product.deliveryAvailableFrom
                    ? product.deliveryAvailableFrom.toLocaleDateString("es-ES")
                    : "No definido"}
                </span>
              </p>
              <p>
                Fin reparto:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {product.deliveryAvailableTo
                    ? product.deliveryAvailableTo.toLocaleDateString("es-ES")
                    : "No definido"}
                </span>
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Contacto</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {product.owner.name
                ? `Publicado por ${product.owner.name}`
                : "Publicado por agricultor"}
            </p>
            <div className="mt-3 grid gap-3">
              {product.contacts.length ? (
                product.contacts.map((contact) => (
                  <div key={contact.id} className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      {contact.method}
                    </p>
                    <p className="mt-1 text-sm font-medium">{contact.value}</p>
                    <p className="text-sm text-[var(--muted)]">{contact.label}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  No hay métodos de contacto públicos definidos.
                </p>
              )}
            </div>
          </section>
        </div>

        {imageUrls.length > 1 ? (
          <section className="mt-6 rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Galería</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {imageUrls.slice(1).map((imageUrl) => (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={product.title}
                  className="h-40 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </section>
        ) : null}

        {product.availability.length ? (
          <section className="mt-6 rounded-[1.5rem] bg-white/75 p-5">
            <h2 className="text-lg font-semibold">Disponibilidad</h2>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--muted)]">
              {product.availability.map((slot) => (
                <li key={slot.id} className="rounded-2xl bg-white px-4 py-3">
                  {slot.startsAt.toLocaleDateString("es-ES")} -{" "}
                  {slot.endsAt.toLocaleDateString("es-ES")}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
