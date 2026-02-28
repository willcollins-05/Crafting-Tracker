export type FullTask = {
    id: number;
    name: string;
    items: FullItem[];
}

export type FullItem = {
    id: number;
    name: string;
    percentageComplete?: number;
    recipes: FullRecipe[];
    taskId?: number | null;
}

export type FullRecipe = {
    id: number;
    quantity: number;
    quantityOwned: number;
    itemId: number;
    materialId: number;
    material: {
        id: number;
        name: string;
    }
}