import UserProfileScreen from "@/screens/profile/UserProfileScreen";

export default async function MeProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserProfileScreen userId={userId} />;
}
