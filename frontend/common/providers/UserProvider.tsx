"use client";

import { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { SessionUser } from "../interfaces/session-user.interface";

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

  return (
    <UserContext value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext>
  );
}
