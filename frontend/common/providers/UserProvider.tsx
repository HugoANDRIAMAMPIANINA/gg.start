"use client";

import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { SessionUser } from "../interfaces/session-user.interface";
import { getCurrentUser } from "@/lib/actions/auth";

export default function UserProvider({
  children,
  initialUser,
}: Readonly<{
  children: React.ReactNode;
  initialUser: SessionUser | null;
}>) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(
    initialUser,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser); // true only if initialUser is null

  useEffect(() => {
    async function fetchCurrentUser() {
      if (!initialUser) {
        const user = await getCurrentUser();
        console.log(user);
        setCurrentUser(user);
        setIsLoading(false);
      }
    }
    fetchCurrentUser();
  }, [initialUser]);

  return (
    <UserContext value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </UserContext>
  );
}
