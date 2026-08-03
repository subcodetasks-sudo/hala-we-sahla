import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BiTableProps = {
  children: ReactNode;
  className?: string;
};

/** Outer bilingual 2-column table matching the government form border. */
export default function BiTable({ children, className }: BiTableProps) {
  return (
    <table className={cn("musaned-bi-table", className)}>
      <tbody>{children}</tbody>
    </table>
  );
}
