import ExpenseClient from "./ExpenseClient";
import { headers, cookies } from "next/headers";

export default async function ExpensePage() {
  const headersList = await headers();
  const cookieStore = await cookies();

  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/expense/list`, {
    headers: {
      cookie: cookieStore.toString(), // ✅ THIS WAS MISSING
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return <ExpenseClient initialExpenses={data.expenses ?? []} />;
}
