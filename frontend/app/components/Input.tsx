import { Error, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

export interface IInput<T extends FieldValues>
  extends Omit<
    TextFieldProps,
    "name" | "value" | "onChange" | "label" | "select"
  > {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
  password?: boolean;
  mask?: "cpf";
  select?: boolean;
  selectValues?: Array<{
    label: string;
    value: string | number;
  }>;
}

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  password = false,
  mask,
  select = false,
  selectValues,
  type,
  ...rest
}: IInput<T>) {
  const [showPassword, setShowPassword] = useState(!password);

  function maskCPF(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <TextField
            {...rest}
            {...field}
            select={select}
            label={label}
            placeholder={placeholder}
            className="w-full"
            color="secondary"
            type={password ? (showPassword ? "text" : "password") : type}
            value={field.value ?? ""}
            onChange={(e) => {
              const newValue = e.target.value;

              field.onChange(mask === "cpf" ? maskCPF(newValue) : newValue);
            }}
            slotProps={{
              input: {
                endAdornment: password ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            error={!!error}
            onBlur={field.onBlur}
          >
            {selectValues?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                <span className="text-[#f4f6fc]">{item.label}</span>
              </MenuItem>
            ))}
          </TextField>

          {!!error?.message && (
            <div className="mt-1 text-red-400">
              <Error className="mr-2 -mt-0.5" />
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
}
