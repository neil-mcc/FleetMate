"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CarTable } from "../components/car-table";
import { AddEditCarDialog } from "../components/add-edit-car-dialog";
import { Button } from "../components/ui/button";
import { Car, KeyRound, Loader2 } from "lucide-react";

export default function Page() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Car className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Fleet-Mate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Your smart car inventory manager. Track service dates, MOT renewals, insurance, and more all in one place.
            </p>
            <Button asChild className="w-full" size="lg">
              <a href="/api/auth/login" className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Login to Get Started
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Fleet</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your vehicles in one place
          </p>
        </div>
        <AddEditCarDialog />
      </div>
      <CarTable />
    </div>
  );
}

