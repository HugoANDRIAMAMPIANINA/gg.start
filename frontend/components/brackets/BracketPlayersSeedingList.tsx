"use client";

import {
  BracketPlayer,
  BracketPlayerSeed,
} from "@/common/interfaces/bracket-player.interface";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { SetStateAction, useState } from "react";
import { updateBracketSeeding } from "@/lib/actions/brackets";
import { useParams } from "next/navigation";
import Button from "../ui/Button";
import Link from "next/link";

interface BracketPlayersSeedingListProps {
  bracketPlayers: BracketPlayer[];
  setBracketPlayers: (value: SetStateAction<BracketPlayer[]>) => void;
}

export default function BracketPlayersSeedingList({
  bracketPlayers,
  setBracketPlayers,
}: BracketPlayersSeedingListProps) {
  const { bracketId } = useParams();
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
            />
          ))}
        </ul>
      </DragDropProvider>

      <Button onClick={handleSave} disabled={saving} width="auto">
        {saving ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Mettre à jour le seeding"
        )}
      </Button>
    </div>
  );
}

interface SortableBracketPlayerProps {
  player: BracketPlayer;
  index: number;
}

function SortableBracketPlayer({ player, index }: SortableBracketPlayerProps) {
  const { ref, handleRef, isDragSource } = useSortable({
    id: player.id,
    index,
  });

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
      <button ref={handleRef} className="btn btn-sm btn-ghost cursor-grab">
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Interface / Drag_Vertical">
            <g id="Vector">
              <path
                d="M14 18C14 18.5523 14.4477 19 15 19C15.5523 19 16 18.5523 16 18C16 17.4477 15.5523 17 15 17C14.4477 17 14 17.4477 14 18Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 18C8 18.5523 8.44772 19 9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 12C14 12.5523 14.4477 13 15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 6C14 6.55228 14.4477 7 15 7C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5C14.4477 5 14 5.44772 14 6Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6C8 6.55228 8.44772 7 9 7C9.55228 7 10 6.55228 10 6C10 5.44772 9.55228 5 9 5C8.44772 5 8 5.44772 8 6Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </button>
    </li>
  );
}
