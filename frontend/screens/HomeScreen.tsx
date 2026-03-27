import Hero from "@/components/Hero";
import SearchButton from "@/components/SearchButton";

export default function HomeScreen() {
  return (
    <>
      <main>
        {/* <h1 className="text-6xl text-center font-bold">gg.start</h1> */}
        {/* <createTournament/> */}
        <Hero />
        <SearchButton />
        {/* <TournamentsList /> */}
      </main>
    </>
  );
}
