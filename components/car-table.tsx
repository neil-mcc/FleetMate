"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, isWithinInterval, addDays } from "date-fns";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AddEditCarDialog } from "./add-edit-car-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import {
  Car as CarIcon,
  Calendar,
  Shield,
  FileText,
  Wrench,
  AlertCircle,
  Loader2,
  Trash2,
  Edit,
  Filter
} from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error loading cars</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CarIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No vehicles yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            Get started by adding your first vehicle to track its service dates, MOT, insurance, and more.
          </p>
          <AddEditCarDialog />
        </CardContent>
      </Card>
    );
  }

  const filterCounts = {
    all: data.length,
    "due-soon": data.filter((c) => {
      const tags = [c.motDueDate, c.nextServiceDue, c.insuranceRenewal, c.taxRenewal]
        .map(getUrgency)
        .filter(Boolean);
      return tags.includes("soon");
    }).length,
    overdue: data.filter((c) => {
      const tags = [c.motDueDate, c.nextServiceDue, c.insuranceRenewal, c.taxRenewal]
        .map(getUrgency)
        .filter(Boolean);
      return tags.includes("overdue");
    }).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({filterCounts.all})
        </Button>
        <Button
          variant={filter === "due-soon" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("due-soon")}
        >
          Due Soon ({filterCounts["due-soon"]})
        </Button>
        <Button
          variant={filter === "overdue" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("overdue")}
        >
          Overdue ({filterCounts.overdue})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((car) => {
          const renderDateBadge = (dateStr?: string | null, label?: string) => {
            if (!dateStr) return null;
            const urgency = getUrgency(dateStr);
            const formattedDate = format(new Date(dateStr), "MMM d, yyyy");

            if (urgency === "overdue") {
              return (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Badge variant="destructive" className="font-normal">
                    {formattedDate}
                  </Badge>
                </div>
              );
            }
            if (urgency === "soon") {
              return (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Badge variant="secondary" className="font-normal">
                    {formattedDate}
                  </Badge>
                </div>
              );
            }
            return (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Badge variant="default" className="font-normal">
                    {formattedDate}
                  </Badge>
              </div>
            );
          };

          const hasOverdue = [
            car.motDueDate,
            car.nextServiceDue,
            car.insuranceRenewal,
            car.taxRenewal
          ].some((date) => getUrgency(date) === "overdue");

          return (
            <Card key={car.id} className={hasOverdue ? "border-destructive" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {car.registrationNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {car.make} {car.model}
                      </p>
                    </div>
                  </div>
                  {hasOverdue && (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="font-normal">
                    <Calendar className="w-3 h-3 mr-1" />
                    {car.year}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-1 pt-0">
                <div className="space-y-0 divide-y">
                  {car.lastServiceDate && (
                    <div className="flex items-center gap-2 py-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last Service:</span>
                      <span className="text-sm font-medium ml-auto">
                        <Badge variant="outline" className="font-normal">
                          {format(new Date(car.lastServiceDate), "MMM d, yyyy")}
                        </Badge>
                      </span>
                    </div>
                  )}
                  {car.nextServiceDue && (
                    <div className="flex items-center gap-2 py-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Next Service:</span>
                      <span className="text-sm font-medium ml-auto">
                        {renderDateBadge(car.nextServiceDue)}
                      </span>
                    </div>
                  )}
                  {car.motDueDate && (
                    <div className="flex items-center gap-2 py-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">MOT Due:</span>
                      <span className="text-sm font-medium ml-auto">
                        {renderDateBadge(car.motDueDate)}
                      </span>
                    </div>
                  )}
                  {car.insuranceRenewal && (
                    <div className="flex items-center gap-2 py-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Insurance:</span>
                      <span className="text-sm font-medium ml-auto">
                        {renderDateBadge(car.insuranceRenewal)}
                      </span>
                    </div>
                  )}
                  {car.taxRenewal && (
                    <div className="flex items-center gap-2 py-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tax Renewal:</span>
                      <span className="text-sm font-medium ml-auto">
                        {renderDateBadge(car.taxRenewal)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-4">
                <AddEditCarDialog initial={car}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </AddEditCarDialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this vehicle?")) {
                      deleteMutation.mutate(car.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

