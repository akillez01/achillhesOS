import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900", className)}
      {...props}
    />
  );
}
