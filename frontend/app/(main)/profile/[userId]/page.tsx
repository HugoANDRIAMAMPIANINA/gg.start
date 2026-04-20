import UserProfileScreen from "@/screens/profile/UserProfileScreen";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;

  return <UserProfileScreen userId={resolvedParams.userId} />;
}
