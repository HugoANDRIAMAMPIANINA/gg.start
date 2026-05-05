"use client";

import { useContext, useEffect, useState } from "react";
import Hero from "@/components/Hero";
import TournamentsSection from "@/components/TournamentsSection";
import apiClient from "@/lib/apiClient";
import { Tournament } from "@/common/interfaces/tournament.interface";
import { UserContext } from "@/common/contexts/UserContext";

export default function HomeScreen() {
  const { currentUser } = useContext(UserContext);
  const [upcoming, setUpcoming] = useState<Tournament[]>([]);
  const [finished, setFinished] = useState<Tournament[]>([]);
  const [organized, setOrganized] = useState<Tournament[]>([]);
  const [participated, setParticipated] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      setLoading(true);

      try {
        const [upcomingResponse, finishedResponse] = await Promise.all([
          apiClient.get<Tournament[]>("/tournaments/recent/upcoming"),
          apiClient.get<Tournament[]>("/tournaments/recent/finished"),
        ]);

        setUpcoming(upcomingResponse.data ?? []);
        setFinished(finishedResponse.data ?? []);

        if (currentUser) {
          const [organizedResult, participatedResult] =
            await Promise.allSettled([
              apiClient.get<Tournament[]>("/tournaments/recent/organized"),
              apiClient.get<Tournament[]>("/tournaments/recent/participated"),
            ]);

          setOrganized(
            organizedResult.status === "fulfilled"
              ? (organizedResult.value.data ?? [])
              : [],
          );
          setParticipated(
            participatedResult.status === "fulfilled"
              ? (participatedResult.value.data ?? [])
              : [],
          );
        } else {
          setOrganized([]);
          setParticipated([]);
        }
      } catch {
        setUpcoming([]);
        setFinished([]);
        setOrganized([]);
        setParticipated([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, [currentUser]);

  return (
    <main>
      <Hero />

      <div className="space-y-10 px-4 py-8">
        {loading ? (
          <div className="space-y-6">
            <div className="h-28 rounded-3xl bg-base-200 animate-pulse" />
            <div className="h-28 rounded-3xl bg-base-200 animate-pulse" />
          </div>
        ) : (
          <>
            <TournamentsSection
              title="À venir"
              tournaments={upcoming}
              emptyMessage="Aucun tournoi à venir pour le moment."
            />

            <TournamentsSection
              title="Récemment terminés"
              tournaments={finished}
              emptyMessage="Aucun tournoi terminé récemment."
            />

            {currentUser && organized.length > 0 && (
              <TournamentsSection
                title="Derniers tournois organisés"
                tournaments={organized}
                emptyMessage="Aucun tournoi organisé récemment."
              />
            )}

            {currentUser && participated.length > 0 && (
              <TournamentsSection
                title="Derniers tournois participés"
                tournaments={participated}
                emptyMessage="Aucun tournoi auquel vous avez participé récemment."
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
