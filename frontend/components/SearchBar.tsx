'use client';

import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/tournaments/research');
  };

  return (
    <button 
      onClick={handleSearch}
      className="btn btn-primary btn-lg"
    >
      Chercher un événement
    </button>
  );
}