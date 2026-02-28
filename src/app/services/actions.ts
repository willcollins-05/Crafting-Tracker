'use server'
import { updateQuantityOwned as updateQuantityOwnedRepo} from "@/app/repository/maindbrepo";



export async function updateQuantityOwned(recipeId: number, quantityOwned: number): Promise<void> {
    await updateQuantityOwnedRepo(recipeId, quantityOwned);
}