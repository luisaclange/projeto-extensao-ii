import { Container, IconButton } from "@mui/material";
import { useState } from "react";
import type { ILote } from "~/types/lote.type";
import { LoaderPage } from "~/components/LoaderPage";
import { ChevronLeft } from "@mui/icons-material";
import { AppBar } from "~/components/AppBar";
import { useNavigate } from "react-router";

export interface IResLote extends ILote {
  createdAt?: string | number | Date;
  numeroPedidos?: number;
  numeroItems?: number;
}

export function UsuariosPage() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <section>
      <AppBar />
      <Container maxWidth="lg" className="my-4">
        {isLoading ? (
          <LoaderPage />
        ) : (
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4 border-b-2 border-dashed pb-2">
                <IconButton onClick={handleBack}>
                  <ChevronLeft fontSize="large" color="secondary" />
                </IconButton>
                <h2>Usuários</h2>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
