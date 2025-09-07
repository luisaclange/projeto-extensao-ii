import { CircularProgress } from "@mui/material";

export function LoaderPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 p-4 h-96">
      <CircularProgress size="4rem" />
      <span className="text-xl">
        <b>Carregando</b>
      </span>
    </div>
  );
}
