"use client";

import {
  BracketPlayer,
  BracketPlayerSeed,
} from "@/common/interfaces/bracket-player.interface";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { SetStateAction, useContext, useState } from "react";
import {
  removePlayerFromBracket,
  updateBracketSeeding,
} from "@/lib/actions/brackets";
import { useParams } from "next/navigation";
import Button from "../ui/Button";
import Link from "next/link";
import { UserContext } from "@/common/contexts/UserContext";
import { isOrganizer } from "@/helpers/user";
import { GripVertical, Trash } from "lucide-react";
import Loader from "../ui/Loader";

interface BracketPlayersSeedingListProps {
  bracketPlayers: BracketPlayer[];
  setBracketPlayers: (value: SetStateAction<BracketPlayer[]>) => void;
  triggerRefetch: () => void;
}

export default function BracketPlayersSeedingList({
  bracketPlayers,
  setBracketPlayers,
  triggerRefetch,
}: BracketPlayersSeedingListProps) {
  const { currentUser } = useContext(UserContext);
  const { bracketId, tournamentId } = useParams();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const payload: BracketPlayerSeed[] = bracketPlayers.map(
      (player, index) => ({
        bracketPlayerId: player.id,
        seed: index + 1,
      }),
    );
    await updateBracketSeeding(bracketId as string, payload);
    setSaving(false);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-124">
      <DragDropProvider
        onBeforeDragStart={(event) => {
          // Optionally prevent dragging
          if (!isOrganizer(currentUser, tournamentId as string)) {
            event.preventDefault();
          }
        }}
        onDragEnd={(event) => {
          const { source, target } = event.operation;
          if (!source || !target) return;
          setBracketPlayers((bracketPlayers) => move(bracketPlayers, event));
        }}
      >
        <ul className="flex flex-col gap-2">
          {bracketPlayers.map((player, index) => (
            <SortableBracketPlayer
              key={player.id}
              player={player}
              index={index}
              triggerRefetch={triggerRefetch}
            />
          ))}
        </ul>
      </DragDropProvider>

      {isOrganizer(currentUser, tournamentId as string) && (
        <Button onClick={handleSave} disabled={saving} width="auto">
          {saving ? <Loader /> : "Mettre à jour le seeding"}
        </Button>
      )}
    </div>
  );
}

interface SortableBracketPlayerProps {
  player: BracketPlayer;
  index: number;
  triggerRefetch: () => void;
}

function SortableBracketPlayer({
  player,
  index,
  triggerRefetch,
}: SortableBracketPlayerProps) {
  const { currentUser } = useContext(UserContext);
  const { tournamentId, bracketId } = useParams();

  const { ref, handleRef, isDragSource } = useSortable({
    id: player.id,
    index,
  });

  const removePlayer = async () => {
    await removePlayerFromBracket(bracketId as string, player.id);
    triggerRefetch();
  };

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between gap-3 p-3 bg-base-200 rounded-box transition-opacity ${
        isDragSource && "brightness-95"
      } w-96`}
    >
      <span className="text-base-content/50 w-6 text-right">{index + 1}</span>
      <Link
        href={`/profile/${player.user.id}`}
        className="font-semibold hover:underline hover:cursor-pointer"
      >
        {player.user.name}
      </Link>
      <div
        className={`flex flex-row gap-2 ${!isOrganizer(currentUser, tournamentId as string) && "invisible"}`}
      >
        <Trash
          width={20}
          onClick={removePlayer}
          className="hover:fill-error hover:cursor-pointer text-error"
        />
        <GripVertical ref={handleRef} width={20} className={"cursor-grab"} />
      </div>
    </li>
  );
}
