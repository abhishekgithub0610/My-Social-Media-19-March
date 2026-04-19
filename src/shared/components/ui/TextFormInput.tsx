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

// // import { type InputHTMLAttributes } from "react";
// // import {
// //   FormControl,
// //   FormGroup,
// //   FormLabel,
// //   type FormControlProps,
// // } from "react-bootstrap";
// // import Feedback from "react-bootstrap/esm/Feedback";
// // import {
// //   Controller,
// //   type FieldPath,
// //   type FieldValues,
// //   type PathValue,
// // } from "react-hook-form";

// // import type { FormInputProps } from "@/types/component";

// // const TextFormInput = <
// //   TFieldValues extends FieldValues = FieldValues,
// //   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
// // >({
// //   name,
// //   containerClassName: containerClass,
// //   control,
// //   id,
// //   label,
// //   noValidate,
// //   labelClassName: labelClass,
// //   required, // ✅ NEW: add required prop
// //   ...other
// // }: FormInputProps<TFieldValues> &
// //   FormControlProps &
// //   InputHTMLAttributes<HTMLInputElement> & {
// //     required?: boolean; // ✅ NEW: explicitly define required prop
// //   }) => {
// //   return (
// //     <Controller<TFieldValues, TName>
// //       name={name as TName}
// //       defaultValue={"" as PathValue<TFieldValues, TName>}
// //       control={control}
// //       render={({ field, fieldState }) => (
// //         <FormGroup className={containerClass}>
// //           {label &&
// //             (typeof label === "string" ? (
// //               <FormLabel htmlFor={id ?? name} className={labelClass}>
// //                 {label}
// //                 {/* ✅ NEW: show red * if required */}
// //                 {required && <span className="text-danger ms-1">*</span>}
// //               </FormLabel>
// //             ) : (
// //               <>{label}</>
// //             ))}
// //           <FormControl
// //             id={id ?? name}
// //             {...other}
// //             {...field}
// //             isInvalid={Boolean(fieldState.error?.message)}
// //           />
// //           {!noValidate && fieldState.error?.message && (
// //             <Feedback type="invalid" className="text-start">
// //               {fieldState.error?.message}
// //             </Feedback>
// //           )}
// //         </FormGroup>
// //       )}
// //     />
// //   );
// // };

// // export default TextFormInput;
