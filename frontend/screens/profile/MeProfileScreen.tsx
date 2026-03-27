"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function MeProfileScreen() {
  const { currentUser } = useContext(UserContext);
  if (!currentUser) {
    redirect("/auth/login");
  }

  return (
    <main>
      <h1>My Profile</h1>
      <h2>{currentUser.username}</h2>
    </main>
  );
}
