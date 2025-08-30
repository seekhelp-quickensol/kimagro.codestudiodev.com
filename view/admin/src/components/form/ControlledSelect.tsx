import { FC } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

interface Option {
  value: string | number;
  label: string;
}

interface ControlledSelectProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors;
  options: Option[];
  placeholder?: string;
  className?: string;
  castToNumber?: boolean;
}

const ControlledSelect: FC<ControlledSelectProps> = ({
  name,
  control,
  errors,
  options,
  placeholder = "Select an option",
  className = "",
  castToNumber = false,
}) => {
  const errorMessage = errors?.[name]?.message?.toString();
  const hasError = Boolean(errorMessage);

  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            value={field.value}
            onChange={(e) =>
              field.onChange(
                castToNumber ? Number(e.target.value) : e.target.value
              )
            }
            className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1 ${
              hasError
                ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
                : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"
            } ${className}`}>
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {hasError && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default ControlledSelect;
