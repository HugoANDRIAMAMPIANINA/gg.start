"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero bg-linear-to-r from-primary to-secondary text-primary-content py-8">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <Link
            href="/"
            className="text-6xl font-bold hover:opacity-80 transition-opacity"
          >
            gg.start
          </Link>
          <p className="py-6 text-xl">competition through community</p>
        </div>
      </div>
    </div>
  );
}
