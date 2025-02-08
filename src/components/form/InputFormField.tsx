import { FieldValues, UseControllerProps } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export interface InputFormFieldProps<T extends FieldValues> {
  controllerProps: UseControllerProps<T>;
  label: string;
  description?: string;
  hidden: boolean;
  valueModifierOnChange?: (item: string) => unknown;
  type?: string;
  placeholder?: string;
}

const InputFormField = <T extends FieldValues>(props: InputFormFieldProps<T>) => {
  const {
    controllerProps,
    label,
    description,
    hidden,
    valueModifierOnChange,
    placeholder,
  } = props

  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem hidden={hidden}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  field.onChange("");
                }
              }}
              onBlur={(e) => {
                if (props.type !== "number") return;
                if (e.target.value === "" || e.target.value === null) {
                  field.onChange(0);
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (valueModifierOnChange) {
                  field.onChange(valueModifierOnChange(value));
                } else {
                  field.onChange(value);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputFormField