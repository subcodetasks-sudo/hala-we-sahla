import { cn } from "@/lib/utils";

type FieldUnderlineProps = {
  value?: string | null;
  /** Approximate character width of the blank line when empty */
  widthCh?: number;
  className?: string;
  /** Force showing underline even when value exists (value sits on the line) */
  alwaysUnderline?: boolean;
  /**
   * Use `ltr` for Latin/numeric values inside Arabic (RTL) cells
   * so names and IDs do not reverse.
   */
  dir?: "ltr" | "rtl" | "auto";
};

/**
 * Renders a filled value on an underline, or an empty underline when missing —
 * matching the blank lines on the original government form.
 */
export default function FieldUnderline({
  value,
  widthCh = 28,
  className,
  alwaysUnderline = true,
  dir = "auto",
}: FieldUnderlineProps) {
  const filled = Boolean(value && String(value).trim());

  return (
    <span
      dir={dir}
      className={cn(
        "inline-block align-baseline text-[10pt] leading-[1.15]",
        dir === "ltr" && "musaned-ltr-value",
        alwaysUnderline || !filled
          ? "border-b border-black px-0.5 min-w-[3ch]"
          : "",
        className,
      )}
      style={
        filled
          ? undefined
          : { minWidth: `${widthCh}ch`, width: `${widthCh}ch` }
      }
    >
      {filled ? value : "\u00A0"}
    </span>
  );
}
