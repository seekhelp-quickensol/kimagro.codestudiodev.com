import { FC } from "react";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  hint?: string;
  success?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}

const NewInput: FC<InputProps> = ({
  type = "text",
  name,
  id,
  placeholder,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  hint,
  register,
  errors,
  ...rest
}) => {
    const errorMessage = typeof name === "string" ? errors?.[name]?.message : undefined;
    const hasError = Boolean(errorMessage);
    
  const inputClasses = [
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-1",
    "dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
    className,
    disabled
      ? "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
      : hasError
      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
      : success
      ? "border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800"
      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800",
  ].join(" ");

  return (
    <div className="relative">
      <input
        type={type}
        id={id || name}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        {...register(name)}
        {...rest}
      />

{(hint || hasError) && (
  <p
    className={`mt-1.5 text-xs ${
      hasError
        ? "text-error-500"
        : success
        ? "text-success-500"
        : "text-error-500"
    }`}
  >
    {hasError ? errorMessage?.toString() : hint}
  </p>
)}

    </div>
  );
};

export default NewInput;