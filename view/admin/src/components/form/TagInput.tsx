import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Controller } from 'react-hook-form';

type OptionType = { label: string; value: string };

interface TagInputProps {
  name: string;
  control: any;
  placeholder?: string;
  defaultOptions?: OptionType[];
  isDisabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  name,
  control,
  placeholder = 'Enter tags...',
  defaultOptions = [],
  isDisabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <CreatableSelect
            {...field}
            isMulti
            isDisabled={isDisabled}
            options={defaultOptions}
            placeholder={placeholder}
            onChange={(val) => field.onChange(val)}
            value={field.value}
            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: fieldState.invalid ? '#e53935' : base.borderColor,
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#e0f2f1',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#00695c',
              }),
            }}
          />
          {fieldState.error && (
            <span style={{ color: '#e53935', fontSize: '0.8rem' }}>
              {fieldState.error.message}
            </span>
          )}
        </>
      )}
    />
  );
};

export default TagInput;