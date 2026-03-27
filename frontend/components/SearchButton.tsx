"use client";

import { useRouter } from "next/navigation";

export default function SearchButton() {
  const router = useRouter();

  const redirectToSearch = () => {
    router.push("/search");
  };

  return (
    <button
      onClick={redirectToSearch}
      className="btn btn-primary btn-lg divider-horizontal mt-6 mx-auto block"
    >
      Chercher un événement
    </button>
  );
}
