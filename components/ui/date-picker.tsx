"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";

type DatePickerProps = {
  value?: string | null; // YYYY-MM-DD or empty
  onChange?: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

function parseYmd(value?: string | null) {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function toYmd(date?: Date | null) {
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", disabled }: DatePickerProps) {
  const selected = useMemo(() => parseYmd(value), [value]);
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled} className="justify-start font-normal w-full">
          {selected ? format(selected, "yyyy-MM-dd") : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          fromYear={currentYear - 1}
          toYear={currentYear + 5}
          onSelect={(d) => {
            const ymd = toYmd(d || undefined);
            onChange?.(ymd);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

