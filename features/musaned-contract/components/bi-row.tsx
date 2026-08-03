import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BiRowProps = {
  en: ReactNode;
  ar: ReactNode;
  shaded?: boolean;
  className?: string;
  enClassName?: string;
  arClassName?: string;
  rowClassName?: string;
};

export default function BiRow({
  en,
  ar,
  shaded = false,
  className,
  enClassName,
  arClassName,
  rowClassName,
}: BiRowProps) {
  return (
    <tr className={cn(shaded && "musaned-shaded", rowClassName)}>
      <td className={cn("musaned-cell musaned-en", className, enClassName)}>
        {en}
      </td>
      <td
        className={cn("musaned-cell musaned-ar", className, arClassName)}
        dir="rtl"
        lang="ar"
      >
        {ar}
      </td>
    </tr>
  );
}
