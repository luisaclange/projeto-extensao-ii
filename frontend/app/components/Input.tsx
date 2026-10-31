import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { useState } from "react";

export interface IInput
  extends Omit<TextFieldProps, "value" | "onChange" | "label" | "select"> {
  value: string | number | undefined;
  setValue: ((value?: string) => void) | ((value?: number) => void);
  label: string;
  placeholder?: string;
  rules?: Array<(value?: any) => boolean | string>;
  password?: boolean;
  mask?: "cpf";
  select?: boolean;
  selectValues?: Array<{
    label: string;
    value: string | number;
  }>;
}

export function Input({
  setValue,
  value = "",
  label,
  placeholder,
  rules = [],
  password = false,
  mask,
  select = false,
  selectValues,
  ...rest
}: IInput) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showPassword, setShowPassword] = useState(!password);

  function maskCPF(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  const onChange = (e: any) => {
    const newValue = e.target.value;

    setValue(mask === "cpf" ? maskCPF(newValue) : newValue);
    setErrorMessage(undefined);
  };

  return (
    <div>
      <TextField
        {...rest}
        select={select}
        value={value}
        label={label}
        placeholder={placeholder}
        className="w-full"
        color="secondary"
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        onBlur={() => {
          setErrorMessage(undefined);
          for (const item of rules) {
            if (typeof item(value) == "string") {
              setErrorMessage(item(value) as string);
              break;
            }
          }
        }}
        slotProps={{
          input: {
            endAdornment: password ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        error={!!errorMessage}
      >
        {selectValues?.map((item) => (
          <MenuItem value={item.value}>
            <span className="text-[#f4f6fc]">{item.label}</span>
          </MenuItem>
        ))}
      </TextField>
      {!!errorMessage ? (
        <div className="mt-1 text-red-500">{errorMessage}</div>
      ) : null}
    </div>
  );
}
