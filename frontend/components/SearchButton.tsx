"use client";

import { useRouter } from "next/navigation";

export default function SearchButton() {
  const router = useRouter();

  const redirectToTournamentsSearch = () => {
    router.push("/tournaments");
  };

  return (
    <button
      onClick={redirectToTournamentsSearch}
      className="btn btn-primary btn-lg divider-horizontal mt-6 mx-auto block"
    >
      Chercher un événement
    </button>
  );
}
