"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { useContext } from "react";

export default function Navbar() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="px-8 text-2xl font-bold">
          gg.start
        </Link>
      </div>
      {currentUser ? (
        <div className="flex gap-4 items-center">
          <span>{currentUser.username}</span>
          {/* Dropdown Menu */}
          <div className="dropdown dropdown-end">
            {/* User Avatar Button*/}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={`https://ui-avatars.com/api/?name=${currentUser.username[0]}`}
                />
              </div>
            </div>
            {/* Dropdown Menu Items */}
            <ul
              tabIndex={-1}
              role="menu"
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3.5 w-52 p-2 shadow"
            >
              <li>
                <Link href={"/profile/me"} className="justify-between">
                  Mon Profil
                </Link>
              </li>
              <li>
                <button onClick={logout}>Déconnexion</button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link href={"/auth/login"} className="btn btn-primary">
          Se connecter
        </Link>
      )}
    </div>
  );
}
