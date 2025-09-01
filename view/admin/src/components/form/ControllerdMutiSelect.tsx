// components/MultiSelect.tsx
import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

type Option = { label: string; value: string };

interface MultiSelectProps {
  name: string;
  control: any;
  options: Option[];
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  name,
  control,
  options,
  placeholder = "Select options",
  isClearable = true,
  isDisabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Select
            {...field}
            isMulti
            options={options}
            placeholder={placeholder}
            isClearable={isClearable}
            isDisabled={isDisabled}
            components={{
              IndicatorSeparator: () => null
            }}
            onChange={(val) => {
              const values = val ? val.map((v) => v.value) : [];
              field.onChange(values);
            }}
            value={options.filter((opt) => field.value?.includes(opt.value))}
            classNamePrefix="react-select"
            className="min-h-11 w-full rounded-lg border appearance-none px-4 py-0.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 w-full bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
          />
          {/* {fieldState.error && (
            <span style={{ color: "red", fontSize: "0.8rem" }}>
              {fieldState.error.message}
            </span>
          )} */}
        </>
      )}
    />
  );
};

export default MultiSelect;
