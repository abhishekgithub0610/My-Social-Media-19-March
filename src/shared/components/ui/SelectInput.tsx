import Select from "react-select";
import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type Props<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: Option[];
  label?: string;
  required?: boolean;
};

const SelectInput = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  required,
}: Props<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {label && (
            <label className="form-label">
              {label} {required && <span className="text-danger">*</span>}
            </label>
          )}

          <Select
            options={options}
            onChange={(val) => field.onChange(val?.value)}
            value={options.find((opt) => opt.value === field.value)}
          />

          {fieldState.error && (
            <div className="text-danger mt-1">{fieldState.error.message}</div>
          )}
        </div>
      )}
    />
  );
};

export default SelectInput;
