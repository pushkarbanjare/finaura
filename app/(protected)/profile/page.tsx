import ProfileClient from "./ProfileClient";
import { headers, cookies } from "next/headers";

export default async function ProfilePage() {
  const headersList = await headers();
  const cookieStore = await cookies();

  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/profile/get`, {
    headers: {
      cookie: cookieStore.toString(), // ✅ THIS WAS MISSING
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const profile = await res.json();
  return <ProfileClient initialProfile={profile} />;
}
