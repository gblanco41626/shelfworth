import React from "react";
import type { ReactNode, FC } from "react";

export const Table: FC<{ columns: string[]; children: ReactNode }> = ({ columns, children }) => (
  <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {columns.map((c) => (
            <th key={c} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
    </table>
  </div>
);
