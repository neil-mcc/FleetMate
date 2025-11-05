"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, isWithinInterval, addDays } from "date-fns";
import { Table, TBody, TH, THead, TR, TD } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AddEditCarDialog } from "./add-edit-car-dialog";

type Car = {
  id: number;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  lastServiceDate?: string | null;
  nextServiceDue?: string | null;
  motDueDate?: string | null;
  insuranceRenewal?: string | null;
  taxRenewal?: string | null;
};

function getUrgency(dateStr?: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  if (isBefore(d, now)) return "overdue" as const;
  if (isWithinInterval(d, { start: now, end: addDays(now, 30) })) return "soon" as const;
  return null;
}

export function CarTable() {
  const [filter, setFilter] = useState<"all" | "due-soon" | "overdue">("all");
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Car[]>({ 
    queryKey: ["cars"], 
    queryFn: async () => {
      const res = await fetch("/api/cars");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load cars: ${res.status} ${errorText}`);
      }
      return res.json();
    },
    retry: 1
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cars"] })
  });

  const filtered = useMemo(() => {
    if (!data) return [] as Car[];
    if (filter === "all") return data;
    return data.filter((c) => {
      const tags = [c.motDueDate, c.nextServiceDue, c.insuranceRenewal, c.taxRenewal]
        .map(getUrgency)
        .filter(Boolean);
      if (filter === "overdue") return tags.includes("overdue");
      if (filter === "due-soon") return tags.includes("soon");
      return true;
    });
  }, [data, filter]);

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/10">
        <p className="text-destructive font-semibold">Error loading cars</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant={filter === "all" ? "default" : "secondary"} onClick={() => setFilter("all")}>All</Button>
        <Button variant={filter === "due-soon" ? "default" : "secondary"} onClick={() => setFilter("due-soon")}>Due Soon</Button>
        <Button variant={filter === "overdue" ? "default" : "secondary"} onClick={() => setFilter("overdue")}>Overdue</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Reg</TH>
              <TH>Make & Model</TH>
              <TH>Year</TH>
              <TH>Last Service</TH>
              <TH>Next Service</TH>
              <TH>MOT Due</TH>
              <TH>Insurance</TH>
              <TH>Tax</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered?.map((car) => {
              const badge = (d?: string | null) => {
                const u = getUrgency(d);
                if (!d) return null;
                const label = format(new Date(d), "yyyy-MM-dd");
                if (u === "overdue") return <Badge variant="destructive">{label}</Badge>;
                if (u === "soon") return <Badge variant="secondary">{label}</Badge>;
                return <span>{label}</span>;
              };
              return (
                <TR key={car.id}>
                  <TD className="font-medium">{car.registrationNumber}</TD>
                  <TD>{car.make} {car.model}</TD>
                  <TD>{car.year}</TD>
                  <TD>{car.lastServiceDate ? format(new Date(car.lastServiceDate), "yyyy-MM-dd") : "-"}</TD>
                  <TD>{badge(car.nextServiceDue)}</TD>
                  <TD>{badge(car.motDueDate)}</TD>
                  <TD>{badge(car.insuranceRenewal)}</TD>
                  <TD>{badge(car.taxRenewal)}</TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <AddEditCarDialog initial={car} />
                      <Button variant="destructive" onClick={() => deleteMutation.mutate(car.id)}>Delete</Button>
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

