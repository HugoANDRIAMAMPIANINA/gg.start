"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeroButtonProps {
  text: string;
  href: string;
}

export default function HeroButton({ text, href }: HeroButtonProps) {
  return (
    <Link href={href}>
      <button className="btn btn-primary btn-lg w-64">{text}</button>
    </Link>
  );
}
