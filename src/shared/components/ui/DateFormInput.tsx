"use client";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Options } from "flatpickr/dist/types/options";
import { useEffect, useRef } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  type Control,
} from "react-hook-form";

type DateFormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  className?: string;
  options?: Options;
  placeholder?: string;
};

const DateFormInput = <T extends FieldValues>({
  name,
  control,
  className,
  options,
  placeholder,
}: DateFormInputProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        useEffect(() => {
          if (!inputRef.current) return;

          const instance = flatpickr(inputRef.current, {
            ...options,
            dateFormat: "Y-m-d",
            defaultDate: field.value || undefined,
            allowInput: true,

            onChange: (selectedDates) => {
              if (selectedDates.length > 0) {
                field.onChange(selectedDates[0].toISOString().split("T")[0]);
              }
            },
          });

          return () => {
            instance.destroy();
          };
        }, [field.value, field.onChange, options]);

        return (
          <input
            ref={inputRef}
            type="text"
            className={className}
            placeholder={placeholder}
            readOnly
          />
        );
      }}
    />
  );
};

export default DateFormInput;
