"use client";

import { UserContext } from "@/common/contexts/UserContext";
import UserAvatar from "@/components/user/UserAvatar";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function MeProfileScreen() {
  const { currentUser, isLoading } = useContext(UserContext);
  if (!currentUser && !isLoading) {
    redirect("/auth/login");
  }

  return (
    <main>
      <UserAvatar />
      {currentUser ? (
        <h2>{currentUser.name}</h2>
      ) : (
        <h2 className="skeleton skeleton-text">Nom d'utilisateur</h2>
      )}
    </main>
  );
}
