"use client";

import * as React from "react";
import { DayPicker, type DayPickerSingleProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "../../lib/utils";

export type CalendarProps = DayPickerSingleProps & { className?: string };

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-2", className)}
      {...props}
    />
  );
}

