import { roboto, robotoMono } from "@/global/fonts";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center items-center gap-4 h-full">
      <h1 className="text-4xl font-medium">404 - Page introuvable</h1>
      <p>Il semble de que vous vous soyez perdus !</p>
      <Link href="/" className="link link-primary">
        Revenir à l'accueil
      </Link>
    </main>
  );
}
