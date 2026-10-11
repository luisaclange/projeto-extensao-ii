import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export interface IInput {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  label: string;
  placeholder?: string;
  rules?: Array<(value?: string) => boolean | string>;
  password?: boolean;
}

export function Input({
  setValue,
  value,
  label,
  placeholder,
  rules = [],
  password = false,
}: IInput) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showPassword, setShowPassword] = useState(!password);

  return (
    <div>
      <TextField
        value={value}
        label={label}
        placeholder={placeholder}
        className="w-full"
        color="secondary"
        type={showPassword ? "text" : "password"}
        onChange={(e) => {
          setValue(e.target.value);
          setErrorMessage(undefined);
        }}
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
      />
      {!!errorMessage ? (
        <div className="mt-1 text-red-500">{errorMessage}</div>
      ) : null}
    </div>
  );
}
