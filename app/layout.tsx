import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "../components/react-query-provider";
import { Navbar } from "../components/navbar";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Inventory",
  description: "Manage your car inventory and due dates"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <ReactQueryProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4">{children}</main>
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

