import ProfileClient from "./ProfileClient";
import { getUserIdFromSession } from "@/lib/auth/session";
import { getProfile } from "@/services/profile.service";

export default async function ProfilePage() {
  const userId = await getUserIdFromSession();
  if (!userId) return null;

  const profile = await getProfile(userId);
  return <ProfileClient initialProfile={profile} />;
}