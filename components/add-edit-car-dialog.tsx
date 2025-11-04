"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type CarInput = {
  registrationNumber: string;
  make: string;
  model: string;
  year: number | string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  motDueDate?: string;
  insuranceRenewal?: string;
  taxRenewal?: string;
};

type Car = CarInput & { id: number };

export function AddEditCarDialog({ initial }: { initial?: Car }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CarInput>({
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
      setOpen(false);
    }
  });

  const Title = initial ? "Edit Car" : "Add Car";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{initial ? "Edit" : "Add Car"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Title}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="grid gap-1">
            <label className="text-sm">Registration Number</label>
            <Input
              value={form.registrationNumber}
              onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-sm">Make</label>
              <Input value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} required />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Model</label>
              <Input value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm">Year</label>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-sm">Last Service</label>
              <DatePicker value={form.lastServiceDate} onChange={(v) => setForm((f) => ({ ...f, lastServiceDate: v }))} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Next Service Due</label>
              <DatePicker value={form.nextServiceDue} onChange={(v) => setForm((f) => ({ ...f, nextServiceDue: v }))} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">MOT Due</label>
              <DatePicker value={form.motDueDate} onChange={(v) => setForm((f) => ({ ...f, motDueDate: v }))} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Insurance Renewal</label>
              <DatePicker value={form.insuranceRenewal} onChange={(v) => setForm((f) => ({ ...f, insuranceRenewal: v }))} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Tax Renewal</label>
              <DatePicker value={form.taxRenewal} onChange={(v) => setForm((f) => ({ ...f, taxRenewal: v }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

