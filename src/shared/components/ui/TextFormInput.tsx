import { type InputHTMLAttributes } from "react";
import {
  FormControl,
  FormGroup,
  FormLabel,
  type FormControlProps,
} from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import { Controller, type FieldValues, type PathValue } from "react-hook-form";

import type { FormInputProps } from "@/types/component";

const TextFormInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  containerClassName,
  control,
  id,
  label,
  noValidate,
  labelClassName,
  required,
  ...other
}: FormInputProps<TFieldValues> &
  FormControlProps &
  InputHTMLAttributes<HTMLInputElement> & {
    required?: boolean;
  }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={"" as PathValue<TFieldValues, typeof name>}
      render={({ field, fieldState }) => (
        <FormGroup className={containerClassName}>
          {label &&
            (typeof label === "string" ? (
              <FormLabel
                htmlFor={id ?? String(name)}
                className={labelClassName}
              >
                {label}
                {required && <span className="text-danger ms-1">*</span>}
              </FormLabel>
            ) : (
              <>{label}</>
            ))}

          <FormControl
            id={id ?? String(name)}
            {...other}
            {...field}
            isInvalid={!!fieldState.error?.message}
          />

          {!noValidate && fieldState.error?.message && (
            <Feedback type="invalid" className="text-start">
              {fieldState.error.message}
            </Feedback>
          )}
        </FormGroup>
      )}
    />
  );
};

export default TextFormInput;
