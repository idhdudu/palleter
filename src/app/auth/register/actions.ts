"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerFormSchema } from "@/lib/product-schema";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerFarmerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerFormSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: "Revisa los campos del formulario." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      role: parsed.data.role,
      passwordHash,
    },
  });

  redirect("/auth/signin?registered=1");
}
