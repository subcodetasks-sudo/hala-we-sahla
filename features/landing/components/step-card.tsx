import Image from "next/image";

import CustomIcon from "@/components/custom-icon";
import { cn } from "@/lib/utils";

type StepCardProps = {
  label: string;
  image: string;
  imageAlt: string;
  arrowPlacement: "top" | "bottom";
  tone: "accent" | "success";
};

export default function StepCard({
  label,
  image,
  imageAlt,
  arrowPlacement,
  tone,
}: StepCardProps) {
  const toneClass =
    tone === "success" ? "text-emerald-500" : "text-accent";

  const labelBlock = (
    <div className={cn("flex flex-col items-center gap-0.5", toneClass)}>
      {arrowPlacement === "top" ? (
        <>
          <span className="text-sm font-semibold">{label}</span>
          <CustomIcon
            src="/landing/icons/step-arrow.svg"
            width={57}
            height={48}
            className={toneClass}
          />
        </>
      ) : (
        <>
          <CustomIcon
            src="/landing/icons/step-arrow.svg"
            width={57}
            height={48}
            className={cn(toneClass, "rotate-180")}
          />
          <span className="text-sm font-semibold">{label}</span>
        </>
      )}
    </div>
  );

  return (
    <article className="flex h-full flex-col items-center">
      <div className="flex min-h-20 w-full flex-col items-center justify-end">
        {arrowPlacement === "top" ? labelBlock : null}
      </div>

      <Image
        src={image}
        alt={imageAlt}
        width={1404}
        height={1816}
        className="h-auto w-full"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
      />

      <div className="flex min-h-20 w-full flex-col items-center justify-start">
        {arrowPlacement === "bottom" ? labelBlock : null}
      </div>
    </article>
  );
}
