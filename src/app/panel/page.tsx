import Link from "next/link";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireFarmerOrAdmin } from "@/lib/authorization";
import { CreateProductForm } from "./create-product-form";
import { deleteProductAction } from "./actions";

export default async function PanelPage() {
  const session = await requireFarmerOrAdmin();
  const isAdmin = session.user.role === Role.ADMIN;
  const products = await prisma.product.findMany({
    where: isAdmin ? {} : { ownerId: session.user.id },
    include: {
      availability: { orderBy: { startsAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { ownerId: session.user.id },
    select: { id: true, status: true, deliveryType: true },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              Panel agricultor
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Bienvenido, {session.user.name ?? "agricultor"}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {isAdmin ? "Vista de administracion" : "Gestion de tus productos"}
            </p>
          </div>

          <div className="rounded-full border border-[var(--panel-border)] bg-white/60 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
            {products.length} productos
          </div>
          <Link
            href="/panel/pedidos"
            className="rounded-full border border-[var(--panel-border)] bg-white/60 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
          >
            {orders.length} pedidos
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
          <CreateProductForm />

          <div className="grid gap-4">
            {products.length ? (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[1.5rem] border border-black/8 bg-white/65 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        {product.category}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        {product.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {product.zone} · {product.public ? "Publico" : "Privado"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/panel/productos/${product.id}/editar`}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <form action={deleteProductAction.bind(null, product.id)}>
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                        >
                          Borrar
                        </button>
                      </form>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[var(--muted)]">Precio</dt>
                      <dd className="font-medium">
                        {(product.priceCents / 100).toFixed(2)} €
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--muted)]">Envio</dt>
                      <dd className="font-medium">
                        {(product.shippingCents / 100).toFixed(2)} €
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm">
                    <p className="font-medium text-[var(--foreground)]">Reparto y recogida</p>
                    <div className="mt-2 grid gap-2 text-[var(--muted)] sm:grid-cols-2">
                      <p>
                        Modo:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {product.deliveryMode === "NONE"
                            ? "Sin reparto"
                            : product.deliveryMode === "RADIUS"
                              ? "Por radio"
                              : product.deliveryMode === "TOWNS"
                                ? "Por poblaciones"
                                : "Radio y poblaciones"}
                        </span>
                      </p>
                      <p>
                        Recogida local:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {product.localPickup ? "Si" : "No"}
                        </span>
                      </p>
                      <p>
                        Radio:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {product.deliveryRadiusKm ? `${product.deliveryRadiusKm} km` : "No definido"}
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
                    </div>
                    <div className="mt-2 grid gap-2 text-[var(--muted)] sm:grid-cols-2">
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
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm">
                    <p className="font-medium text-[var(--foreground)]">Medidas y precios</p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[var(--muted)]">Formatos de venta</p>
                        {Array.isArray(product.saleOptions) && product.saleOptions.length ? (
                          <ul className="mt-2 grid gap-2">
                            {product.saleOptions.map((option) => {
                              if (
                                typeof option === "object" &&
                                option !== null &&
                                "label" in option &&
                                "priceCents" in option
                              ) {
                                const typed = option as {
                                  label: string;
                                  priceCents: number;
                                };
                                return (
                                  <li
                                    key={`${typed.label}-${typed.priceCents}`}
                                    className="rounded-2xl bg-white/80 px-3 py-2 text-[var(--foreground)]"
                                  >
                                    {typed.label} - {(typed.priceCents / 100).toFixed(2)} €
                                  </li>
                                );
                              }

                              return null;
                            })}
                          </ul>
                        ) : (
                          <p className="mt-2 text-[var(--foreground)]">Sin formatos definidos</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[var(--muted)]">Tramos de precio</p>
                        {Array.isArray(product.pricingTiers) && product.pricingTiers.length ? (
                          <ul className="mt-2 grid gap-2">
                            {product.pricingTiers.map((tier) => {
                              if (
                                typeof tier === "object" &&
                                tier !== null &&
                                "minQuantity" in tier &&
                                "maxQuantity" in tier &&
                                "unit" in tier &&
                                "pricePerUnitCents" in tier
                              ) {
                                const typed = tier as {
                                  minQuantity: number;
                                  maxQuantity: number;
                                  unit: string;
                                  pricePerUnitCents: number;
                                };
                                return (
                                  <li
                                    key={`${typed.minQuantity}-${typed.maxQuantity}-${typed.unit}-${typed.pricePerUnitCents}`}
                                    className="rounded-2xl bg-white/80 px-3 py-2 text-[var(--foreground)]"
                                  >
                                    {typed.minQuantity}-{typed.maxQuantity} {typed.unit.toLowerCase()} · {(typed.pricePerUnitCents / 100).toFixed(2)} € / unidad
                                  </li>
                                );
                              }

                              return null;
                            })}
                          </ul>
                        ) : (
                          <p className="mt-2 text-[var(--foreground)]">Sin tramos definidos</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-[var(--muted)]">
                    Disponibilidad:
                    {product.availability.length ? (
                      <ul className="mt-2 grid gap-2">
                        {product.availability.map((slot) => (
                          <li
                            key={slot.id}
                            className="rounded-2xl bg-white/70 px-4 py-2 text-[var(--foreground)]"
                          >
                            {slot.startsAt.toLocaleDateString("es-ES")} -{" "}
                            {slot.endsAt.toLocaleDateString("es-ES")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="ml-2 text-[var(--foreground)]">
                        Sin fechas definidas
                      </span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white/55 p-6 text-sm text-[var(--muted)]">
                Todavia no tienes productos publicados.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
