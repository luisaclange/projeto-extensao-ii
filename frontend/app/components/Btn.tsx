import { Button, CircularProgress, type ButtonProps } from "@mui/material";

export interface IBtn
  extends Omit<ButtonProps, "variant" | "isLoading" | "onClick"> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

export function Btn({
  variant = "primary",
  children,
  isLoading = false,
  onClick,
  ...rest
}: IBtn) {
  return (
    <Button
      {...rest}
      className={`h-full min-h-14 ${rest.className}`}
      variant={variant == "primary" ? "contained" : "outlined"}
      color="primary"
      disabled={isLoading}
      onClick={onClick}
      style={{ minWidth: "120px" }}
      sx={{
        "&.Mui-disabled": {
          backgroundColor:
            variant === "primary" ? "primary.main" : "transparent",
          color: variant === "primary" ? "white" : "primary.main",
          opacity: 1,
          borderColor: variant === "secondary" ? "primary.main" : undefined,
        },
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <b>{children}</b>
      )}
    </Button>
  );
}
