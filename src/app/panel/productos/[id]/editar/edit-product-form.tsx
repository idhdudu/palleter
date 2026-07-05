"use client";

import { useActionState } from "react";
import { ProductCategory, type Product } from "@prisma/client";
import { updateProductAction, type ProductActionState } from "@/app/panel/actions";

const initialState: ProductActionState = {};

export function EditProductForm({ product }: { product: Product & { availability: { id: string; startsAt: Date; endsAt: Date }[] } }) {
  const [state, formAction, pending] = useActionState(
    updateProductAction.bind(null, product.id),
    initialState,
  );

  const fieldClassName =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]";
  const availability = product.availability[0];

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
        Editar producto
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{product.title}</h1>

      <label className="mt-6 block">
        <span className="text-sm font-medium">Titulo</span>
        <input
          name="title"
          defaultValue={product.title}
          className={fieldClassName}
          required
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Slug</span>
        <input
          name="slug"
          defaultValue={product.slug}
          className={fieldClassName}
          required
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Descripcion</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product.description ?? ""}
          className={fieldClassName}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Categoria</span>
          <select
            name="category"
            defaultValue={product.category}
            className={fieldClassName}
          >
            <option value={ProductCategory.HORTALIZAS}>Hortalizas</option>
            <option value={ProductCategory.FRUTAS}>Frutas</option>
            <option value={ProductCategory.VERDURAS}>Verduras</option>
            <option value={ProductCategory.ACEITES}>Aceites</option>
            <option value={ProductCategory.MIEL}>Miel</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Zona</span>
          <input
            name="zone"
            defaultValue={product.zone}
            className={fieldClassName}
            required
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Peso minimo (kg)</span>
          <input
            name="minWeightKg"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.minWeightKg.toString()}
            className={fieldClassName}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Peso maximo (kg)</span>
          <input
            name="maxWeightKg"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.maxWeightKg.toString()}
            className={fieldClassName}
            required
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Precio (€)</span>
          <input
            name="priceCents"
            type="number"
            min="0"
            defaultValue={product.priceCents}
            className={fieldClassName}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Envio (€)</span>
          <input
            name="shippingCents"
            type="number"
            min="0"
            defaultValue={product.shippingCents}
            className={fieldClassName}
            required
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Disponible desde</span>
          <input
            name="availabilityStartsAt"
            type="date"
            defaultValue={availability ? availability.startsAt.toISOString().slice(0, 10) : ""}
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Disponible hasta</span>
          <input
            name="availabilityEndsAt"
            type="date"
            defaultValue={availability ? availability.endsAt.toISOString().slice(0, 10) : ""}
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm font-medium">
        <input
          name="public"
          type="checkbox"
          defaultChecked={product.public}
          className="h-4 w-4"
        />
        Producto publico
      </label>

      {state.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
