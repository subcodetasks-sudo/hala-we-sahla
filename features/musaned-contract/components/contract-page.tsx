import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContractPageProps = {
  children: ReactNode;
  pageNumber?: number;
  className?: string;
  /** Show footer page number like original page 1 */
  showFooterNumber?: boolean;
};

/**
 * Single A4 sheet — matches PDF page size 595.92 × 842.88 pt.
 */
export default function ContractPage({
  children,
  pageNumber,
  className,
  showFooterNumber = false,
}: ContractPageProps) {
  return (
    <section
      className={cn("musaned-page", className)}
      data-page={pageNumber}
      aria-label={pageNumber ? `Contract page ${pageNumber}` : "Contract page"}
    >
      <div className="musaned-page-inner">{children}</div>
      {showFooterNumber && pageNumber != null ? (
        <div className="musaned-page-footer-num">{pageNumber}</div>
      ) : null}
    </section>
  );
}
