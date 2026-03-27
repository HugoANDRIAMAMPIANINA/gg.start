"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { useContext } from "react";
import ThemeToggle from "./theme/ThemeToggle";

export default function Navbar() {
  const { currentUser, isLoading } = useContext(UserContext);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="px-8 text-2xl font-bold">
          gg.start
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        {currentUser ? (
          <div className="flex gap-4 items-center">
            <span>Bienvenue, {currentUser.username}</span>
            <UserDropdown username={currentUser.username} />
          </div>
        ) : isLoading ? (
          <UserAvatarMenuTriggerSkeleton />
        ) : (
          <LoginButton />
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}

interface UserDropdownProps {
  username: string;
}

function UserDropdown({ username }: UserDropdownProps) {
  const usernameInitial = username[0];
  return (
    <div className="dropdown dropdown-end">
      {/* User Avatar Menu Trigger */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar avatar-placeholder"
      >
        <div className="w-12 rounded-full bg-base-300">
          <span className="text-lg">{usernameInitial}</span>
        </div>
      </div>
      {/* Menu */}
      <ul
        tabIndex={0}
        role="menu"
        className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3.5 w-52 p-2 shadow"
      >
        <li>
          <Link href={"/profile/me"} className="justify-between">
            Mon Profil
          </Link>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
}

function UserAvatarMenuTriggerSkeleton() {
  return (
    <div className="btn btn-ghost btn-circle avatar skeleton">
      <div className="w-12 rounded-full" />
    </div>
  );
}

function LoginButton() {
  return (
    <Link href={"/auth/login"} className="btn btn-primary">
      Se connecter
    </Link>
  );
}

function LogoutButton() {
  async function handleLogout() {
    await logout();
  }
  return <button onClick={handleLogout}>Déconnexion</button>;
}
