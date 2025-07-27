import type { IItem } from "./item.type";

export interface IPedido {
    id: string;
    loteId: string;
    cliente: string;
    items: IItem[];
}