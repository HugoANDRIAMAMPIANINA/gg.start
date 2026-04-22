import type { Metadata } from "next";
import { roboto, robotoMono } from "@/global/fonts";
import "./globals.css";
import UserProvider from "@/common/providers/UserProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "gg.start",
  description: "Interactive Web App for Tournaments and Brackets management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dracula">
      <body
        className={`${roboto.variable} ${robotoMono.variable} min-h-screen antialiased`}
      >
        <UserProvider initialUser={null}>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
