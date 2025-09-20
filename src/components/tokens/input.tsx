import React from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, FC, ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";

type BaseProps = {
  label: string;
  error?: string;
  className?: string;
};

const baseClassName = 'w-full rounded-xl px-2 focus:border-transparent';
const errorClassName = 'mt-1 text-xs text-rose-600';

const Field: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <label className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 text-sm text-slate-700">
    <span className="font-medium text-slate-600">{label}</span>
    <span className="sm:col-span-2">{children}</span>
  </label>
);

const InputField: FC<BaseProps & InputHTMLAttributes<HTMLInputElement>> = ({ label, error, className = "", type, ...props }) => (
  <Field label={label}>
    <input
      type={type}
      {...props}
      className={`${baseClassName} ${className}`}
    />
    {error && <p className={errorClassName}>{error}</p>}
  </Field>
);

const Text: FC<BaseProps & InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <InputField type="text" {...props}/>
);

const Number: FC<BaseProps & InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <InputField type="number" {...props}/>
);

const Date: FC<BaseProps & InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <InputField type="date" {...props}/>
);

const Select: FC<BaseProps & SelectHTMLAttributes<HTMLSelectElement>> = ({ label, error, className = "", children, ...props }) => (
  <Field label={label}>
    <select
      {...props}
      className={`${baseClassName} ${className}`}
    >
      {children}
    </select>
    {error && <p className={errorClassName}>{error}</p>}
  </Field>
);

const Search: FC<InputHTMLAttributes<HTMLInputElement>> = ({value, onChange, placeholder = "Search" }) => (
  <div className="relative w-full sm:w-72">
    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
    />
  </div>
);


export const Input = {
  Text, Number, Date, Select, Search
}
