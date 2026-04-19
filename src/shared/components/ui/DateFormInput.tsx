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

// // "use client";
// // import flatpickr from "flatpickr";
// // import { Options } from "flatpickr/dist/types/options";
// // import { useCallback, useEffect, useRef, useState } from "react";

// // type FlatpickrProps = {
// //   className?: string;
// //   value?: Date | [Date, Date];
// //   options?: Options;
// //   placeholder?: string;
// //   getValue?: (date: Date | Date[]) => void;
// // };

// // const DateFormInput = ({
// //   className,
// //   options,
// //   placeholder,
// //   value,
// //   getValue,
// // }: FlatpickrProps) => {
// //   const element = useRef<HTMLInputElement | null>(null);

// //   const handleDateChange = useCallback(
// //     (selectedDates: Date[]) => {
// //       const newDate =
// //         selectedDates.length === 1 ? selectedDates[0] : selectedDates;
// //       getValue?.(newDate);
// //     },
// //     [getValue],
// //   );

// //   useEffect(() => {
// //     if (element.current) {
// //       const instance = flatpickr(element.current, {
// //         ...options,
// //         defaultDate: value,
// //         onChange: (selectedDates) => handleDateChange(selectedDates),
// //       });

// //       return () => {
// //         instance.destroy();
// //       };
// //     }
// //   }, [value, options, handleDateChange]);

// //   return (
// //     <input ref={element} className={className} placeholder={placeholder} />
// //   );
// // };

// // export default DateFormInput;
