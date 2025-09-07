import { Button, Container, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import api from "~/services/axios";
import type { IItem } from "~/types/item.type";
import type { IPedido } from "~/types/pedido.type";
import type { IProduto } from "~/types/produto.type";

export function PedidoPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const loteId = searchParams.get("loteId");

  const navigate = useNavigate();

  const [pedido, setPedido] = useState<IPedido>();
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [items, setItems] = useState<Partial<IItem>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeItemsList = (index: number, key: string, value: string) => {
    const listToEdit = [...items];
    listToEdit[index] = {
      ...listToEdit[index],
      [key]: value,
    };
    setItems(listToEdit);
  };

  const handleDeleteItem = (index: number) => {
    const listToEdit = [...items];

    listToEdit.splice(index, 1);

    setItems(listToEdit);
  };

  const handleSavePedido = async () => {
    if (id) {
      await api.put(`/pedidos/${id}`, { ...pedido, items });
    } else {
      await api.post("/pedidos", { ...pedido, items });
    }
    navigate(`/lote?id=${loteId}`);
  };

  const handleRedirectLote = () => {
    navigate(`/lote?id=${loteId}`);
  };

  const handleAddItem = () => {
    const listToEdit = [...items];
    listToEdit.push({});
    setItems(listToEdit);
  };

  useEffect(() => {
    setIsLoading(true);
    const listPromises = [api.get("/produtos")];

    if (id) {
      listPromises.push(api.get(`/pedidos/${id}`));
    }

    Promise.all(listPromises)
      .then((data) => {
        const [resProdutos, resPedido] = data;
        setProdutos(resProdutos.data);
        setPedido(resPedido?.data);
        setItems(resPedido?.data?.items || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <div className="bg-gray-500">
        <Container
          maxWidth="lg"
          className="py-4 flex justify-between items-center"
        >
          <h1>Pedido</h1>
        </Container>
      </div>

      <Container maxWidth="lg">
        {isLoading ? (
          <span>Carregando...</span>
        ) : (
          <div>
            <TextField
              label="Cliente"
              value={pedido?.cliente}
              onChange={(e) =>
                setPedido({ ...pedido!, cliente: e.target.value })
              }
            />

            <h3>Itens</h3>

            {items.map((item, index) => (
              <div className="flex flex-row gap-4">
                <Select
                  label="Produto"
                  value={item.produtoId}
                  onChange={(e) =>
                    handleChangeItemsList(index, "produtoId", e.target.value)
                  }
                >
                  {produtos.map((prod) => (
                    <MenuItem value={prod._id}>{prod.nome}</MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Quantidade"
                  value={item.qtde}
                  onChange={(e) =>
                    handleChangeItemsList(index, "qtde", e.target.value)
                  }
                />

                <Button onClick={() => handleDeleteItem(index)}>Excluir</Button>
              </div>
            ))}

            <Button onClick={handleAddItem}>Adicionar item</Button>

            <div>
              <Button onClick={handleRedirectLote}>Cancelar</Button>
              <Button variant="contained" onClick={handleSavePedido}>
                Salvar
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
