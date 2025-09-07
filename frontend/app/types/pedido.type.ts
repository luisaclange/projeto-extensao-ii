import type { IItem } from "./item.type";

export interface IPedido {
    _id: string;
    loteId: string;
    cliente: string;
    items: IItem[];
}