'use server';
import { db } from "@/db";
import { items, recipes, tasks, materials } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import { Item, Material, Recipe, Task } from "@/types/dbtypes"; 
import { FullItem, FullRecipe, FullTask } from "./dtos";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";

export async function getAllTasks(): Promise<FullTask[]> {
    try {
        const tasksWithItems = 
            await db.query.tasks.findMany({
                with: {
                    items: {
                        with: {
                            recipes: {
                                with: {
                                    materials: true
                                }
                            }
                        }
                    }
                }
            });
    
        return tasksWithItems.map(task => ({
            ...task,
            items: task.items.map(item => ({
                ...item,
                recipes: item.recipes.map(recipe => ({
                    ...recipe,
                    material: recipe.materials, 
                }))
            }))
        })); 
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

export async function getAllItems(): Promise<FullItem[]> {
    try {
        const itemsWithRecipes = await db.query.items.findMany({
            with: {
                recipes: {
                    with: {
                        materials: true
                    }
                }
            }
        })
        return itemsWithRecipes.map(item => ({
            ...item,
            recipes: item.recipes.map(recipe => ({
                ...recipe,
                material: recipe.materials
            }))
        }));
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
}

export async function getAllMaterials(): Promise<Material[]> {
    try {
        const materialsToReturn = await db.select().from(materials).all();
        return materialsToReturn;
    } catch (error) {
        console.error("Error fetching materials:", error);
        return [];
    }
}

export async function addNewMaterial(name: string): Promise<Material | null> {
    try {
        const newMaterial = await db.insert(materials).values({ name }).returning();
        return newMaterial[0] || null;
    } catch (error) {
        console.error("Error adding material:", error);
        return null;
    }
}

export async function addNewItem(name: string, taskId: number | null): Promise<Item | null> {
    try {
        const newItem = await db.insert(items).values({ name, taskId }).returning();
        return newItem[0] || null; 
    } catch (error) {
        console.error("Error adding item:", error);
        return null;
    }
}

export async function addNewTask(name: string): Promise<Task | null> {
    try {
        const newTask = await db.insert(tasks).values({ name }).returning();
        return newTask[0] || null;
    } catch (error) {
        console.error("Error adding task:", error);
        return null;
    }
}

export async function addNewRecipe(itemId: number, materialId: number, quantity: number): Promise<Recipe | null> {
    try {
        const newRecipe = await db.insert(recipes).values({ itemId, materialId, quantity, quantityOwned: 0 }).returning();
        return newRecipe[0] || null;
    } catch (error) {
        console.error("Error adding recipe:", error);
        return null;
    }
}

export async function deleteRecipe(recipeId: number): Promise<void> {
    try {
        await db.delete(recipes).where(eq(recipes.id, recipeId));
    } catch (error) {  
        console.error("Error deleting recipe:", error);
    }
}

export async function deleteItem(itemId: number): Promise<void> {
    try {
        const recipesToDelete = await db.select().from(recipes).where(eq(recipes.itemId, itemId));
        const deleteRecipePromises = recipesToDelete.map(recipe =>
            db.delete(recipes).where(eq(recipes.id, recipe.id))
        );
        await Promise.all(deleteRecipePromises);
        await db.delete(items).where(eq(items.id, itemId));
    } catch (error) {
        console.error("Error deleting item:", error);
    }
}

export async function deleteTask(taskId: number): Promise<void> {
    try {
        console.log(taskId)
        const itemsToDelete = await db.select().from(items).where(eq(items.taskId, taskId));
        const deleteItemPromises = itemsToDelete.map(item => {
            return deleteItem(item.id);
        })
        await Promise.all(deleteItemPromises);
        await db.delete(tasks).where(eq(tasks.id, taskId));
    } catch (error) {
        console.error("Error deleting task:", error); 
    }
}

export async function deleteMaterial(materialId: number): Promise<void> {
    try {
        const recipesToDelete = await db.select().from(recipes).where(eq(recipes.materialId, materialId))
        const deleteRecipePromises = recipesToDelete.map(recipe => {
            return db.delete(recipes).where(eq(recipes.id, recipe.id));
        });
        await Promise.all(deleteRecipePromises);
        await db.delete(materials).where(eq(materials.id, materialId));
    } catch (error) {
        console.error("Error deleting material:", error);
    }
}

export async function updateTaskName(taskId: number, newName: string): Promise<void> {
    try {
        await db.update(tasks).set({ name: newName }).where(eq(tasks.id, taskId));
    } catch (error) {
        console.error("Error updating task name:", error);
    }
}

export async function updateItemName(itemId: number, newName: string): Promise<void> {
    try {
        await db.update(items).set({ name: newName }).where(eq(items.id, itemId));
    } catch (error) {
        console.error("Error updating item name:", error);
    }
}

export async function updateMaterialName(materialId: number, newName: string): Promise<void> {
    try {
        await db.update(materials).set({ name: newName }).where(eq(materials.id, materialId));
    } catch (error) {
        console.error("Error updating material name:", error);
    }
}

export async function updateRecipeQuantity(recipeId: number, newQuantity: number): Promise<void> {
    try {
        await db.update(recipes).set({ quantity: newQuantity }).where(eq(recipes.id, recipeId));   
    } catch (error) {
        console.error("Error updating recipe quantity:", error);
    }
}

export async function updateRecipeMaterial(recipeId: number, newMaterialId: number): Promise<void> {
    try {
        await db.update(recipes).set({ materialId: newMaterialId }).where(eq(recipes.id, recipeId));   
    } catch (error) {
        console.error("Error updating recipe material:", error);
    }
}

export async function updateRecipeItem(recipeId: number, newItemId: number): Promise<void> {
    try {
        await db.update(recipes).set({ itemId: newItemId }).where(eq(recipes.id, recipeId));
    } catch (error) {
        console.error("Error updating recipe item:", error);
    }
}

export async function updateQuantityOwned(recipeId: number, quantityOwned: number): Promise<void> {
    try {
        await db.update(recipes).set({ quantityOwned }).where(eq(recipes.id, recipeId));
    }
    catch (error) {
        console.error("Error updating quantity owned:", error);
    }
}

export async function getTaskById(taskId: number): Promise<FullTask | null> {
    try {
        const task = await db.query.tasks.findFirst({
            where: eq(tasks.id, taskId),
            with: {
                items: {
                    with: {
                        recipes: {
                            with: {
                                materials: true
                            }
                        }
                    }
                }
            }
        });
        if (!task) return null;
        return {
            ...task,
            items: task.items.map(item => ({
                ...item,
                recipes: item.recipes.map(recipe => ({
                    ...recipe,
                    material: recipe.materials
                }))
            }))
        };
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        return null;
    }
}

export async function getMaterialById(materialId: number): Promise<Material | null> {
    try {
        const material = (await db.select().from(materials).where(eq(materials.id, materialId))).at(0);
        return material || null;
    } catch (error) {
        console.error("Error fetching material by ID:", error);
        return null;
    }
}

export async function getItemById(itemId: number): Promise<FullItem | null> {
    try {
        const item = await db.query.items.findFirst({
            where: eq(items.id, itemId),
            with: {
                recipes: {
                    with: {
                        materials: true
                    }
                }
            }
        });
        if (!item) return null;
        return {
            ...item,
            recipes: item.recipes.map(recipe => ({
                ...recipe,
                material: recipe.materials
            }))
        };
    } catch (error) {
        console.error("Error fetching item by ID:", error);
        return null;
    }
}

export async function getRecipeById(recipeId: number): Promise<FullRecipe | null> {
    try {
        const recipe = await db.query.recipes.findFirst({
            where: eq(recipes.id, recipeId),
            with: {
                materials: true
            }
        });
        if (!recipe) return null;
        return {
            ...recipe,
            material: recipe.materials
        };
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        return null;
    }
}

export async function addExistingItemToTask(taskId: number, itemId: number): Promise<Item | null> {
    try {
        const updatedItem = await db.update(items).set({ taskId }).where(eq(items.id, itemId)).returning();
        return updatedItem[0] || null;
    } catch (error) {
        console.error("Error adding existing item to task:", error);
        return null;
    }
}

export async function getAllItemsNotInTask(taskId: number): Promise<FullItem[]> {
    try {
        const itemsInTask = await db.select().from(items).where(eq(items.taskId, taskId)).all();
        const itemsInTaskIds = itemsInTask.map(i => i.id);
        const itemsNotInTask = await db.query.items.findMany({
            where: (item, { not }) => not(eq(item.taskId, taskId)),
            with: {
                recipes: {
                    with: {
                        materials: true
                    }
                }
            }
        });
        return itemsNotInTask.map(item => ({
            ...item,
            recipes: item.recipes.map(recipe => ({
                ...recipe,
                material: recipe.materials
            }))
        }));
    } catch (error) {
        console.error("Error fetching items not in task:", error);
        return [];
    }
}

export async function getAllItemsNotInAnyTask(): Promise<FullItem[]> {
    try {
        const itemsNotInTask = await db.query.items.findMany({
            where: isNull(items.taskId),
            with: {
                recipes: {
                    with: {
                        materials: true
                    }
                }
            }
        });
        return itemsNotInTask.map(item => ({
            ...item,
            recipes: item.recipes.map(recipe => ({
                ...recipe,
                material: recipe.materials
            }))
        }));
    } catch (error) {
        console.error("Error fetching items not in any task:", error);
        return [];
    }
}

export async function removeItemFromTask(itemId: number): Promise<void> {
    try {
        await db.update(items).set({ taskId: null }).where(eq(items.id, itemId));
    } catch (error) {
        console.error("Error removing item from task:", error);
    }
}

export async function createFullItem(itemName: string, recipe: {materialId: number, quantity: number, name: string}[]): Promise<Item | null> {
    try {
        const newItem = await addNewItem(itemName, null);
        if (!newItem) throw new Error("Failed to create item");
        const createRecipePromises = recipe.map(r =>
            addNewRecipe(newItem.id, r.materialId, r.quantity)
        );
        await Promise.all(createRecipePromises);
        return { ...newItem };
    } catch (error) {
        console.error("Error creating item from full item:", error);
        return null;
    }
}

export async function updateRecipeGoal(recipeId: number, value: number): Promise<void> {
    try {
        await db.update(recipes).set({ quantity: value}).where(eq(recipes.id, recipeId));
    } catch (error) {
        console.error("Error updating quantity of recipe: ", error);
    }
}

export async function createFullTask(taskName: string, itemIds: number[]): Promise<void> {
    try {
        const newTask = await addNewTask(taskName)
        const promises = itemIds.map((id) => {
            return addExistingItemToTask(newTask?.id === undefined ? -1 : newTask!.id, id);
        });
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating full task: ", error);
    }

}