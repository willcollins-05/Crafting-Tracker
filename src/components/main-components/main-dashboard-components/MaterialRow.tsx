'use client'
import { useState, useEffect } from "react";
import { FullRecipe } from "@/app/repository/dtos";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Recipe } from "@/types/dbtypes";

interface MaterialRowProps {
  recipe: FullRecipe;
  onQuantityChange: (recipeId: number, value: string) => void;
}

export function MaterialRow({ recipe, onQuantityChange }: MaterialRowProps) {
  const [quantityOwned, setQuantityOwned] = useState<string>("")
  const percent = Math.min(Math.round((recipe.quantityOwned / recipe.quantity) * 100), 100);

  useEffect(() => {
    setQuantityOwned(String(recipe.quantityOwned))
  }, [])

  useEffect(() => {
    if (Number.isFinite(Number(quantityOwned))) {
      if (Number(quantityOwned) > recipe.quantity) {
        setQuantityOwned(String(recipe.quantity));
      }
      onQuantityChange(recipe.id, quantityOwned);
    }
  }, [quantityOwned])

  return (
    <div className="grid grid-cols-4 items-center gap-4 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-md">
      <span className="text-xs font-mono">{recipe.material.name}</span>
      <span className="text-xs font-medium">{recipe.quantity}</span>
      <Input
        type="text"
        value={quantityOwned}
        onChange={(e) => setQuantityOwned(e.target.value)}
        className="h-7 w-16 text-xs"
      />
      <div className="flex flex-col items-end gap-1">
        <span className="text-[9px] font-bold">{percent}%</span>
        <Progress value={percent} className="h-1 w-full" />
      </div>
    </div>
  );
}