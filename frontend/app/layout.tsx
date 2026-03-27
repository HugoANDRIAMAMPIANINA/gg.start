import type { Metadata } from "next";
import { roboto, robotoMono } from "@/global/fonts";
import "./globals.css";
import UserProvider from "@/common/providers/UserProvider";
import { SessionUser } from "@/common/interfaces/session-user.interface";
import { getCurrentUser } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "gg.start",
  description: "Interactive Web App for Tournaments and Brackets management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = `${roboto.variable} ${robotoMono.variable} antialiased`;
  const user: SessionUser | null = await getCurrentUser();

  return (
    <html lang="en">
      <body className={className}>
        <UserProvider initialUser={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
