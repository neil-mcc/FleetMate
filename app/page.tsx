"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CarTable } from "../components/car-table";
import { AddEditCarDialog } from "../components/add-edit-car-dialog";

export default function Page() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Fleet-Mate</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to manage your cars.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Cars</h1>
        <AddEditCarDialog />
      </div>
      <CarTable />
    </div>
  );
}

