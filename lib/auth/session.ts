import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded?.userId ?? null;
}
