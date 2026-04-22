"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tournament } from "@/common/interfaces/tournament.interface";
import { User } from "@/common/interfaces/user.interface";
import apiClient from "@/lib/apiClient";
import TournamentsSection from "@/components/TournamentsSection";

interface UserProfileScreenProps {
  userId?: string;
}

export default function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const params = useParams();
  const resolvedUserId = userId ?? (Array.isArray(params.userId) ? params.userId[0] : params.userId);
  const [user, setUser] = useState<User | null>(null);
  const [organized, setOrganized] = useState<Tournament[]>([]);
  const [participated, setParticipated] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      if (!resolvedUserId) {
        setError("Impossible de charger les informations du profil. (userId manquant)");
        setLoading(false);
        return;
      }

      try {
        const [userResponse, organizedResponse, participatedResponse] = await Promise.all([
          apiClient.get<User>(`/users/${resolvedUserId}`),
          apiClient.get<Tournament[]>(`/tournaments/recent/organized/user/${resolvedUserId}`),
          apiClient.get<Tournament[]>(`/tournaments/recent/participated/user/${resolvedUserId}`),
        ]);

        setUser(userResponse.data);
        setOrganized(organizedResponse.data ?? []);
        setParticipated(participatedResponse.data ?? []);
      } catch (err: any) {
        setUser(null);
        setOrganized([]);
        setParticipated([]);

        const message =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "Impossible de charger les informations du profil.";

        setError(`Impossible de charger les informations du profil. (${message})`);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [resolvedUserId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <div className="h-28 rounded-3xl bg-base-200 animate-pulse" />
          <div className="h-28 rounded-3xl bg-base-200 animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl border border-base-200 bg-base-100 p-8 text-center text-sm text-muted-foreground">
          {error || "Profil introuvable."}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-base-200 bg-base-100 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profil visiteur</p>
              <h2 className="text-3xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <TournamentsSection
        title="Derniers tournois organisés"
        tournaments={organized}
        emptyMessage="Aucun tournoi organisé récemment par cet utilisateur."
      />

      <TournamentsSection
        title="Derniers tournois participés"
        tournaments={participated}
        emptyMessage="Aucun tournoi participé récemment par cet utilisateur."
      />
    </main>
  );
}
