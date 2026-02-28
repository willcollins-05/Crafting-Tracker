'use client'
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input";
import { FullRecipe } from "@/app/repository/dtos";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function RecipeRow({ 
  recipe, 
  onUpdate,
  onUpdateGoal,
  onRemoveMaterial
}: { 
  recipe: FullRecipe; 
  onUpdate: (recipeId: number, val: string) => void,
  onUpdateGoal: (rId: number, val: string) => void;
  onRemoveMaterial: (itemId: number, recipeId: number) => void;
}) {
  const [quantity, setQuantity] = useState<string>("");
  const [quantityOwned, setQuantityOwned] = useState<string>("");

  useEffect(() => {
    setQuantity(String(recipe.quantity));
    setQuantityOwned(String(recipe.quantityOwned));
  }, [])

  useEffect(() => {
    const quantityNum = Number(quantity)
    if (!Number.isFinite(quantityNum)) return;

    onUpdateGoal(recipe.id, quantity)

    const quantityOwnedNum = Number(quantityOwned);
    if (!Number.isFinite(quantityOwnedNum)) return;

    if (quantityOwnedNum > quantityNum) {
      setQuantityOwned(quantity);
    }
  }, [quantity])

  useEffect(() => {
    const quantityOwnedNum = Number(quantityOwned)
    if (!Number.isFinite(quantityOwnedNum)) return;

    const quantityNum = Number(quantity)

    if (!Number.isFinite(quantityNum)) return;
    if (quantityOwnedNum > quantityNum) {
      setQuantityOwned(quantity);
    }

    onUpdate(recipe.id, quantityOwned)
  }, [quantityOwned])

  return (
    <div className="grid grid-cols-12 items-center gap-4 bg-secondary/20 p-3 rounded-lg border border-border/50">
      {/* Material Name from the nested object */}
      <div className="col-span-5 flex flex-col">
        <span className="text-sm font-semibold">{recipe.material.name}</span>
        <span className="text-[10px] text-muted-foreground uppercase font-mono">ID: {recipe.materialId}</span>
      </div>

      <div className="col-span-3 text-center">
        <span className="text-[10px] text-muted-foreground block uppercase">Goal</span>
        <Input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="h-8 w-full text-center font-mono bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      <div className="col-span-3 text-center">
        <span className="text-[10px] text-muted-foreground block uppercase">Owned</span>
        <Input
          type="text"
          value={quantityOwned}
          onChange={(e) => setQuantityOwned(e.target.value)}
          className="h-8 w-full text-center font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      
      <div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the accordion from toggling
            onRemoveMaterial(recipe.itemId, recipe.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}