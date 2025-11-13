"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DatePicker } from "./ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Plus } from "lucide-react";

type CarInput = {
  registrationNumber: string;
  make: string;
  model: string;
  year: number | string;
  lastServiceDate?: string | null;
  nextServiceDue?: string | null;
  motDueDate?: string | null;
  insuranceRenewal?: string | null;
  taxRenewal?: string | null;
};

type Car = CarInput & { id: number };

export function AddEditCarDialog({ initial, children }: { initial?: Car; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const getInitialForm = (): CarInput => ({
    registrationNumber: initial?.registrationNumber || "",
    make: initial?.make || "",
    model: initial?.model || "",
    year: initial?.year ?? "",
    lastServiceDate: initial?.lastServiceDate?.slice(0, 10) || "",
    nextServiceDue: initial?.nextServiceDue?.slice(0, 10) || "",
    motDueDate: initial?.motDueDate?.slice(0, 10) || "",
    insuranceRenewal: initial?.insuranceRenewal?.slice(0, 10) || "",
    taxRenewal: initial?.taxRenewal?.slice(0, 10) || ""
  });

  const [form, setForm] = useState<CarInput>(getInitialForm());

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form when dialog opens
      setForm(getInitialForm());
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const method = initial ? "PUT" : "POST";
      const url = initial ? `/api/cars/${initial.id}` : "/api/cars";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: Number(form.year) || 0,
          lastServiceDate: form.lastServiceDate || null,
          nextServiceDue: form.nextServiceDue || null,
          motDueDate: form.motDueDate || null,
          insuranceRenewal: form.insuranceRenewal || null,
          taxRenewal: form.taxRenewal || null
        })
      });
      if (!res.ok) throw new Error("Failed to save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      handleOpenChange(false);
    }
  });

  const title = initial ? "Edit Vehicle" : "Add New Vehicle";
  const description = initial
    ? "Update the details of your vehicle"
    : "Add a new vehicle to your fleet";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Vehicle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-6 pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration">Registration Number *</Label>
              <Input
                id="registration"
                placeholder="e.g., AB12 CDE"
                value={form.registrationNumber}
                onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g., Toyota"
                  value={form.make}
                  onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Corolla"
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Service & Maintenance</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastService">Last Service Date</Label>
                <DatePicker
                  value={form.lastServiceDate}
                  onChange={(v) => setForm((f) => ({ ...f, lastServiceDate: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextService">Next Service Due</Label>
                <DatePicker
                  value={form.nextServiceDue}
                  onChange={(v) => setForm((f) => ({ ...f, nextServiceDue: v }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">Legal Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mot">MOT Due Date</Label>
                <DatePicker
                  value={form.motDueDate}
                  onChange={(v) => setForm((f) => ({ ...f, motDueDate: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Renewal</Label>
                <DatePicker
                  value={form.insuranceRenewal}
                  onChange={(v) => setForm((f) => ({ ...f, insuranceRenewal: v }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax Renewal</Label>
                <DatePicker
                  value={form.taxRenewal}
                  onChange={(v) => setForm((f) => ({ ...f, taxRenewal: v }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : initial ? "Update Vehicle" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

