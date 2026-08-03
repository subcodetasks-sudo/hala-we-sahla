import { Noto_Sans_Arabic } from "next/font/google";
import type { CSSProperties } from "react";
import type { MusanedContractData } from "../types/musaned-contract";
import MusanedPage1 from "./pages/musaned-page-1";
import MusanedPage2 from "./pages/musaned-page-2";
import MusanedPage3 from "./pages/musaned-page-3";
import MusanedPage4 from "./pages/musaned-page-4";
import MusanedPage5 from "./pages/musaned-page-5";
import MusanedPage6 from "./pages/musaned-page-6";
import MusanedPage7 from "./pages/musaned-page-7";
import MusanedPage8 from "./pages/musaned-page-8";
import "../musaned-contract.css";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-sans-arabic",
});

type MusanedContractProps = {
  data: MusanedContractData;
  className?: string;
};

/**
 * Official Musaned Filipino domestic-worker employment contract.
 * Pass API response as `data` — missing fields render as blank underlines.
 */
export default function MusanedContract({
  data,
  className,
}: MusanedContractProps) {
  const style = {
    ["--musaned-font-ar"]:
      "var(--font-noto-sans-arabic), 'Noto Sans Arabic', Tahoma, Arial, sans-serif",
  } as CSSProperties;

  return (
    <div
      className={`musaned-contract ${notoSansArabic.variable} ${className ?? ""}`}
      style={style}
      dir="ltr"
      lang="en"
    >
      <MusanedPage1 data={data} />
      <MusanedPage2 data={data} />
      <MusanedPage3 />
      <MusanedPage4 />
      <MusanedPage5 />
      <MusanedPage6 data={data} />
      <MusanedPage7 data={data} />
      <MusanedPage8 data={data} />
    </div>
  );
}
