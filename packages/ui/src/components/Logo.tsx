import React from "react";
import { cn } from "../lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Logo({ width = 40, height = 40, className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -10 120 140"
      width={width}
      height={height}
      className={cn("text-primary", className)}
      {...props}
    >
      <defs>
        <mask id="concept11">
          <path
            d="M 12 110 L 12 55 A 48 48 0 0 1 108 55 L 108 110 Z"
            fill="white"
            stroke="white"
            strokeWidth="14"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect
            x="12"
            y="7"
            width="20"
            height="50"
            rx="4"
            fill="white"
            stroke="white"
            strokeWidth="14"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 74 150 L 74 82 L 86 82 L 60 48 L 34 82 L 46 82 L 46 150 Z"
            fill="black"
            stroke="black"
            strokeWidth="18"
            strokeLinejoin="round"
            strokeLinecap="round"
            transform="translate(-8, 0) rotate(20 60 110)"
          />
        </mask>
      </defs>
      <rect
        x="-20"
        y="-30"
        width="160"
        height="180"
        fill="currentColor"
        mask="url(#concept11)"
      />
    </svg>
  );
}
