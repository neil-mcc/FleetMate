"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "./ui/button";

export function Navbar() {
  const { user } = useUser();
  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">Car Inventory</Link>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.name || user.email}</span>
              <Button variant="secondary" asChild>
                <a href="/api/auth/logout">Logout</a>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <a href="/api/auth/login">Login</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

