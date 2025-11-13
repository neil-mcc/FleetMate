import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "../components/react-query-provider";
import { Navbar } from "../components/navbar";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleet-Mate",
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
            <main className="min-h-[calc(100vh-4rem)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

