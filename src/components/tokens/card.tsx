import React from 'react';

import type { ReactNode, FC } from 'react';

export const Card: FC<{ title?: string; icon?: ReactNode; actions?: ReactNode; children: ReactNode }> = ({ title, icon, actions, children }) => (
  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
    {title && (
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-sm font-semibold tracking-wide text-slate-700">{title}</h3>
        </div>
        {actions}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);
