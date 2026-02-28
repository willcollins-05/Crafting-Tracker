'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import { ChevronLeft, Plus } from 'lucide-react';  // Professional back icon
import { Button } from '@/components/ui/button';
import { FullItem, FullRecipe } from '../repository/dtos';
import { Material } from '@/types/dbtypes';
import { addNewRecipe, deleteRecipe, getAllItems, getAllMaterials, updateRecipeGoal, deleteItem } from '../repository/maindbrepo';
import { ItemCard } from '@/components/main-components/ItemDetail/ItemCard';
import { Skeleton } from '@/components/ui/skeleton';
import { updateQuantityOwned } from '@/app/services/actions';

export default function Page() {
    const [isLoading, setIsLoading] = useState(true);
    const [itemsToDisplay, setItemsToDisplay] = useState<FullItem[]>([]);
    const [allMaterials, setAllMaterials] = useState<Material[]>([]);
    const router = useRouter();

    const routerPush = (path: string) => {
        router.push(path);
    }
    
    useEffect(() => {
        Promise.all([getAllItems(), getAllMaterials()]).then(([items, materials]) => {
            setItemsToDisplay(items);
            setAllMaterials(materials);
            setIsLoading(false);
        });
    }, []);

    const handleUpdate = async (itemId: number, recipeId: number, newValue: string) => {
        const numValue = parseInt(newValue) || 0;
        setItemsToDisplay(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            if (item.recipes.find((recipe) => recipe.id === recipeId)!.quantity < Number(newValue)) return item
            if (Number(newValue) < 0) return item
            const updatedRecipes = item.recipes.map(r => r.id === recipeId ? { ...r, quantityOwned: numValue } : r);

            // Recalculate item-level percentage
            const totalNeeded = updatedRecipes.reduce((s, r) => s + r.quantity, 0);
            const totalOwned = updatedRecipes.reduce((s, r) => s + r.quantityOwned, 0);
            const newPercent = totalNeeded > 0 ? (totalOwned / totalNeeded) * 100 : 0;
            
            return { ...item, recipes: updatedRecipes, percentageComplete: newPercent }; 
        }));
        await updateQuantityOwned(recipeId, numValue);
    };

    const handleAddMaterial = async (itemId: number, material: Material) => {
        // 1. Call Server Action to create the recipe row
        const newRecipeRow = await addNewRecipe(itemId, material.id, 1);

        if (newRecipeRow === null) return;
        
        // 2. Update local state
        setItemsToDisplay(prev => prev.map(item => {
            if (item.id !== itemId) return item;

            const newFullRecipe: FullRecipe = {
                id: newRecipeRow.id,
                itemId: itemId,
                materialId: material.id,
                quantity: newRecipeRow.quantity || 1,
                quantityOwned: 0,
                material: material
            }

            return {
                ...item,
                recipes: [...item.recipes, newFullRecipe]
            }
        }));
    };

    const handleRemoveMaterial = async (itemId: number, recipeId: number) => {
        await deleteRecipe(recipeId);
        setItemsToDisplay(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, recipes: item.recipes.filter(r => r.id !== recipeId) };
        }));
    };

    const handleGoalUpdate = async (itemId: number, recipeId: number, newValue: string) => {
        const numValue = parseInt(newValue) || 1; // Default to 1 to avoid division by 0

        // Optimistic UI
        setItemsToDisplay(prev => prev.map(item => {
            if (item.id !== itemId) return item;
            const updatedRecipes = item.recipes.map(r => 
                r.id === recipeId ? { ...r, quantity: numValue } : r
            );
            
            // Recalculate progress based on new goal
            const totalNeeded = updatedRecipes.reduce((s, r) => s + r.quantity, 0);
            const totalOwned = updatedRecipes.reduce((s, r) => s + r.quantityOwned, 0);
            return { 
                ...item, 
                recipes: updatedRecipes, 
                percentageComplete: totalNeeded > 0 ? (totalOwned / totalNeeded) * 100 : 0 
            };
        }));

        // Server Action
        await updateRecipeGoal(recipeId, numValue); 
    };

    const onItemDelete = (itemId: number) => {
        setItemsToDisplay((prev) => {
            const newItemsToDisplay = prev.map((item) => {
                if (item.id !== itemId) return item
            })
            return newItemsToDisplay.filter((item) => item !== undefined);
        });

        deleteItem(itemId);
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => routerPush("/")} 
                    className="group w-fit -ml-3 text-muted-foreground"
                >
                    <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Button>
            </div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Library</h1>
                    <p className="text-muted-foreground">Modify existing recipes or track progress.</p>
                </div>
                <Button onClick={() => router.push("/items/create")} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> New Item
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            ) : (
                <div className="space-y-4">
                    {itemsToDisplay.map(item => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            allMaterials={allMaterials} // Pass master list for the modal
                            onRecipeUpdate={handleUpdate}
                            onAddMaterial={handleAddMaterial}
                            onRemoveMaterial={handleRemoveMaterial}
                            onGoalUpdate={handleGoalUpdate}
                            onItemDelete={onItemDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}