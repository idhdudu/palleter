"use client";

import { useActionState } from "react";
import { DeliveryMode, ProductCategory } from "@prisma/client";
import { createProductAction, type ProductActionState } from "./actions";

const initialState: ProductActionState = {};

export function CreateProductForm() {
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialState,
  );

  const fieldClassName =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]";

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="rounded-[1.5rem] border border-black/8 bg-white/65 p-5"
    >
      <h2 className="text-xl font-semibold">Nuevo producto</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Crea una ficha con categorias, precio, peso y disponibilidad.
      </p>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Titulo</span>
        <input name="title" className={fieldClassName} required />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Slug</span>
        <input
          name="slug"
          className={fieldClassName}
          placeholder="tomate-raf"
          required
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Descripcion</span>
        <textarea name="description" rows={4} className={fieldClassName} />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Imagenes del producto</span>
        <input
          name="imagesFiles"
          type="file"
          accept="image/*"
          multiple
          className={fieldClassName}
        />
        <p className="mt-2 text-xs text-[var(--muted)]">
          Sube una o varias imágenes. También puedes pegar URLs debajo.
        </p>
        <textarea
          name="imagesText"
          rows={4}
          className={fieldClassName}
          placeholder="https://.../imagen1.jpg&#10;https://.../imagen2.jpg"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Categoria</span>
          <select
            name="category"
            className={fieldClassName}
            defaultValue={ProductCategory.HORTALIZAS}
            required
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
          <input name="zone" className={fieldClassName} required />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Modo de reparto</span>
          <select
            name="deliveryMode"
            defaultValue={DeliveryMode.NONE}
            className={fieldClassName}
          >
            <option value={DeliveryMode.NONE}>Sin reparto</option>
            <option value={DeliveryMode.RADIUS}>Por radio</option>
            <option value={DeliveryMode.TOWNS}>Por poblaciones</option>
            <option value={DeliveryMode.BOTH}>Radio y poblaciones</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Radio de reparto (km)</span>
          <input
            name="deliveryRadiusKm"
            type="number"
            min="1"
            step="1"
            className={fieldClassName}
            placeholder="Ej. 25"
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
            className={fieldClassName}
            defaultValue={0}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Medidas / formatos de venta</span>
        <textarea
          name="saleOptionsText"
          rows={4}
          className={fieldClassName}
          placeholder="1|KG|350&#10;2|KG|650&#10;1|L|450"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Tramos de precio por cantidad</span>
        <textarea
          name="pricingTiersText"
          rows={4}
          className={fieldClassName}
          placeholder="1|5|KG|200&#10;5|10|KG|150&#10;1|5|L|220"
        />
      </label>

      <div className="mt-4 rounded-[1.5rem] border border-black/5 bg-white/55 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
          Disponibilidad
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Indica el rango exacto de fechas en el que el producto se puede vender.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Disponible desde</span>
            <input name="availabilityStartsAt" type="date" className={fieldClassName} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Disponible hasta</span>
            <input name="availabilityEndsAt" type="date" className={fieldClassName} />
          </label>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Inicio reparto</span>
          <input
            name="deliveryAvailableFrom"
            type="date"
            className={fieldClassName}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Fin reparto</span>
          <input
            name="deliveryAvailableTo"
            type="date"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Poblaciones de reparto</span>
        <textarea
          name="deliveryTowns"
          rows={3}
          className={fieldClassName}
          placeholder="Ej. Alzira, Xativa, Gandia"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Notas de reparto</span>
          <textarea
            name="deliveryNotes"
            rows={3}
            className={fieldClassName}
            placeholder="Horario, condiciones, costes..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Notas recogida local</span>
          <textarea
            name="pickupNotes"
            rows={3}
            className={fieldClassName}
            placeholder="Direccion, horarios, punto de entrega..."
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm font-medium">
        <input name="public" type="checkbox" defaultChecked className="h-4 w-4" />
        Producto publico
      </label>

      <label className="mt-4 flex items-center gap-3 text-sm font-medium">
        <input name="localPickup" type="checkbox" defaultChecked className="h-4 w-4" />
        Permite recogida local
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
        {pending ? "Guardando..." : "Crear producto"}
      </button>
    </form>
  );
}
