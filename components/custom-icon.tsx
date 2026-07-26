"use client";

import { ReactSVG } from "react-svg";

import { cn } from "@/lib/utils";

type CustomIconProps = {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
};

function uniquifySvgIds(svg: SVGSVGElement) {
  const uid = `i${Math.random().toString(36).slice(2, 9)}`;

  svg.querySelectorAll("[id]").forEach((el) => {
    const oldId = el.getAttribute("id");
    if (!oldId) return;

    const newId = `${oldId}-${uid}`;
    el.setAttribute("id", newId);

    svg.querySelectorAll(`[filter="url(#${oldId})"]`).forEach((node) => {
      node.setAttribute("filter", `url(#${newId})`);
    });
    svg.querySelectorAll(`[fill="url(#${oldId})"]`).forEach((node) => {
      node.setAttribute("fill", `url(#${newId})`);
    });
    svg.querySelectorAll(`[stroke="url(#${oldId})"]`).forEach((node) => {
      node.setAttribute("stroke", `url(#${newId})`);
    });
    svg.querySelectorAll(`[href="#${oldId}"]`).forEach((node) => {
      node.setAttribute("href", `#${newId}`);
    });
    svg.querySelectorAll(`[xlink\\:href="#${oldId}"]`).forEach((node) => {
      node.setAttribute("xlink:href", `#${newId}`);
    });
  });
}

function injectSvgColors(
  svg: SVGSVGElement,
  width: number,
  height: number,
) {
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  uniquifySvgIds(svg);

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
  width,
  height,
  className,
}: CustomIconProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;

  return (
    <ReactSVG
      src={src}
      beforeInjection={(svg) =>
        injectSvgColors(svg, resolvedWidth, resolvedHeight)
      }
      wrapper="span"
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:block",
        className,
      )}
    />
  );
}
