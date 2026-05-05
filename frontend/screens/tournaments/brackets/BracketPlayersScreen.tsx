"use client";

import { UserContext } from "@/common/contexts/UserContext";
import { BracketPlayer } from "@/common/interfaces/bracket-player.interface";
import { User } from "@/common/interfaces/user.interface";
import BracketPlayersSeedingList from "@/components/brackets/BracketPlayersSeedingList";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { Modal } from "@/components/ui/Modal";
import { isOrganizer, isPlayer } from "@/helpers/user";
import { registerUserToBracket } from "@/lib/actions/brackets";
import { fetchUsersByName } from "@/lib/actions/users";
import apiClient from "@/lib/apiClient";
import LoadingScreen from "@/screens/LoadingScreen";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function BracketPlayersScreen() {
  const { bracketId, tournamentId } = useParams();
  const { currentUser, isLoading } = useContext(UserContext);

  const [bracketPlayers, setBracketPlayers] = useState<BracketPlayer[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const [isRegisterUserModalOpen, setIsRegisterUserModalOpen] =
    useState<boolean>(false);
  const [searchedUsername, setSearchedUsername] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<User[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(false);
  const [userToRegister, setUserToRegister] = useState<User>();

  useEffect(() => {
    async function fetchBracketPlayers() {
      try {
        const response = await apiClient.get(`/brackets/${bracketId}/players`);
        const bracketPlayers: BracketPlayer[] = response.data;
        if (bracketPlayers) {
          setBracketPlayers(bracketPlayers);
        }
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }
    if (!isRegisterUserModalOpen) {
      fetchBracketPlayers();
    }
  }, [isRegisterUserModalOpen]);

  const selectUserToRegister = async (user: User) => {
    setUserToRegister(userToRegister === user ? undefined : user);
  };

  const registerUser = async (userId: string) => {
    const errorMessage = await registerUserToBracket(
      userId,
      bracketId as string,
    );
    if (errorMessage) {
      setModalErrorMessage(errorMessage);
    }
    setIsRegisterUserModalOpen(true);
    setIsRegisterUserModalOpen(false);
  };

  useEffect(() => {
    async function fetchUsers() {
      const users = await fetchUsersByName(searchedUsername);
      setFetchingUsers(false);
      setFoundUsers(users);
    }

    setFetchingUsers(true);
    const timeoutId = setTimeout(fetchUsers, 500);

    return () => {
      clearTimeout(timeoutId);
      setFetchingUsers(false);
    };
  }, [searchedUsername]);

  if (loading) return <LoadingScreen />;

  if (bracketPlayers) {
    return (
      <main className="px-16 py-8 flex flex-col">
        <div className="flex flex-col gap-4">
          <div>
            {" "}
            <span className="text-md font-semibold opacity-50 uppercase">
              Seeding
            </span>
            <h1 className="text-3xl font-bold">Participants de l'arbre</h1>
          </div>
          {!isLoading && currentUser && (
            <div className="flex flex-row gap-2">
              {!isPlayer(currentUser, bracketId as string) && (
                <div className="flex flex-row gap-4">
                  <Button onClick={() => registerUser(currentUser.id)}>
                    S'inscrire à l'arbre de tournoi
                  </Button>
                </div>
              )}
              {isOrganizer(currentUser, tournamentId as string) && (
                <Button onClick={() => setIsRegisterUserModalOpen(true)}>
                  Inscrire un joueur
                </Button>
              )}
            </div>
          )}
        </div>
        {error && <p className="text-error">{error}</p>}
        <Divider />

        <BracketPlayersSeedingList
          bracketPlayers={bracketPlayers}
          setBracketPlayers={setBracketPlayers}
        />

        <Modal title="Inscrire un joueur" open={isRegisterUserModalOpen}>
          {userToRegister && (
            <span className="badge badge-primary badge-md">{`Utilisateur à inscrire : ${userToRegister.name}`}</span>
          )}
          <Input
            id="username"
            name="username"
            placeholder="Rechercher un joueur"
            value={searchedUsername}
            onChange={(event) => setSearchedUsername(event.target.value)}
            autoComplete="off"
          />
          <ul className="menu flex-nowrap bg-base-200 rounded-box w-full mt-2 h-48 overflow-x-auto">
            <li className="menu-title">Utilisateurs trouvés</li>
            {foundUsers.length === 0 && (
              <li className="text-balance">Aucun utilisateur trouvé</li>
            )}
            {foundUsers.map((user) => (
              <li className={`${fetchingUsers && "skeleton"}`} key={user.id}>
                <button onClick={() => selectUserToRegister(user)}>
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="modal-action">
            <Button
              disabled={!userToRegister}
              onClick={() => registerUser(userToRegister!.id)}
            >
              Valider
            </Button>
            <Button
              color="none"
              onClick={() => setIsRegisterUserModalOpen(false)}
            >
              Fermer
            </Button>
          </div>
        </Modal>
      </main>
    );
  }
}
