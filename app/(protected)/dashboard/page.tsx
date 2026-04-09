import { cookies } from "next/headers";
import DashboardClient from "./DashboardClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://finaura-app.vercel.app"
    : "http://localhost:3000");

export default async function DashboardPage() {
  const cookieHeader = (await cookies()).toString();

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const res = await fetch(
    `${BASE_URL}/api/dashboard?month=${month}&year=${year}`,
    {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  const isDemoUser = data.email === "test@mail.com";

  return (
    <>
      {isDemoUser && (
        <div className="mx-auto max-w-6xl px-4 pt-4 text-center text-sm text-foreground/60">
          Please check <strong>April 2025</strong> for analytics.
        </div>
      )}

      <DashboardClient
        userName={data.userName ?? ""}
        goalAmount={data.goalAmount ?? null}
        goalYear={data.goalYear ?? null}
        initialMonth={month}
        initialYear={year}
        initialSummary={data}
        initialInsights={data.insights ?? []}
      />
    </>
  );
}
