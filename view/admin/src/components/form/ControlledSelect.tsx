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
  onSelect?: (value: string | number) => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;


}

const ControlledSelect: FC<ControlledSelectProps> = ({
  name,
  control,
  errors,
  options,
  placeholder = "Select an option",
  className = "",
  castToNumber = false,
  onChange, onSelect 
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
            onChange={(e) => {
              const value = castToNumber ? Number(e.target.value) : e.target.value;
              field.onChange(value);
              onChange?.(e); // Custom onChange
              onSelect?.(value); // Custom onSelect
            }}
          
            
            className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1 ${hasError
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
      <div className="icon-container" aria-hidden="true"><svg height="20" fill="hsl(0, 0%, 80%)" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div>
      {hasError && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default ControlledSelect;
