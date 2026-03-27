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
      className="btn btn-primary btn-lg divider-horizontal mt-6 mx-auto block"
    >
      Chercher un événement
    </button>
  );
}