"use client";

import { ReactSVG } from "react-svg";

import { cn } from "@/lib/utils";

type CustomIconProps = {
    src: string;
    size?: number;
    className?: string;
};

function injectSvgColors(svg: SVGSVGElement, size: number) {
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    svg.querySelectorAll<SVGElement>("[fill]").forEach((el) => {
        if (el.getAttribute("fill") !== "none") {
            el.setAttribute("fill", "currentColor");
        }
    });

    svg.querySelectorAll<SVGElement>("[stroke]").forEach((el) => {
        if (el.getAttribute("stroke") !== "none") {
            el.setAttribute("stroke", "currentColor");
        }
    });
}

export default function CustomIcon({
    src,
    size = 24,
    className,
}: CustomIconProps) {
    return (
        <ReactSVG
            src={src}
            beforeInjection={(svg) => injectSvgColors(svg, size)}
            wrapper="span"
            className={cn(
                "inline-flex shrink-0 items-center justify-center [&_svg]:block",
                className
            )}
        />
    );
}