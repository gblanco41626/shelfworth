// components/charts/PriceSparkline.tsx
"use client";

import React from "react";

export default function PriceSparkline({
  points,
  width = 420,
  height = 80,
  className = "",
}: {
  points: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (!points.length) {
    return (
      <div className="h-20 flex items-center justify-center text-xs text-slate-400">
        No data
      </div>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const padY = 6;

  const n = points.length;
  const stepX = n > 1 ? width / (n - 1) : 0;

  const yScale = (v: number) => {
    if (max === min) return height / 2;
    // invert y so higher values are higher on the chart
    return padY + (height - padY * 2) * (1 - (v - min) / (max - min));
  };

  const coords = points.map((v, i) => [i * stepX, yScale(v)] as const);
  const d =
    coords.length === 1
      ? `M0 ${coords[0][1]} H${width}`
      : `M${coords[0][0]} ${coords[0][1]} ` +
        coords.slice(1).map(([x, y]) => `L${x} ${y}`).join(" ");

  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-label="Price over time"
    >
      {/* baseline */}
      <line
        x1="0"
        y1={yScale(min)}
        x2={width}
        y2={yScale(min)}
        className="stroke-slate-200"
      />
      {/* path */}
      <path d={d} className="fill-none stroke-sky-600" strokeWidth={2} />
      {/* last point */}
      <circle cx={lastX} cy={lastY} r={3} className="fill-sky-600" />
    </svg>
  );
}
