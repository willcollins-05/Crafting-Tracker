import { StringToBoolean } from "class-variance-authority/types";

export type Material = {
    id: number;
    name: string;
}

export type Item = {
    id: number;
    name: string;
    recipe?: Recipe[];
    percentageComplete?: number | null;
}

export type Recipe = {
    id: number;
    itemId: number;
    materialId: number;
    quantity: number;
    quantityOwned: number;
}

export type Task = {
    id: number;
    name: string;
    items?: Item[];
}