"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "./ui/button";
import { Car, LogOut, User } from "lucide-react";

export function Navbar() {
  const { user } = useUser();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Car className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Fleet-Mate
            </span>
          </Link>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name || user.email}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/auth/logout" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </a>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <a href="/api/auth/login">Login</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

