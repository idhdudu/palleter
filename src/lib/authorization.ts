import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getCurrentSession } from "@/lib/session";

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/auth/signin");
  return session;
}

export async function requireFarmerOrAdmin() {
  const session = await requireSession();
  const role = session.user.role;
  if (role !== Role.AGRICULTOR && role !== Role.ADMIN) {
    redirect("/");
  }

  return session;
}
