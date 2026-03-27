interface UserProfileScreenProps {
  userId: string;
}

export default function UserProfileScreen({ userId }: UserProfileScreenProps) {
  return (
    <main>
      <h1>User Profile</h1>
      <h2>{userId}</h2>
    </main>
  );
}
