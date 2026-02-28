import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { FullItem } from "@/app/repository/dtos";
import { RecipeRow } from "./RecipeRow";
import { AddMaterialModal } from "../CreateItem/AddMaterialModal";
import { Material } from "@/types/dbtypes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function ItemCard({ 
  item, 
  onRecipeUpdate,
  onGoalUpdate,
  allMaterials,
  onAddMaterial,
  onRemoveMaterial,
  onItemDelete
}: { 
  item: FullItem; 
  onRecipeUpdate: (itemId: number, recipeId: number, val: string) => void,
  onGoalUpdate: (itemId: number, recipeId: number, val: string) => void,
  allMaterials: Material[],
  onAddMaterial: (itemId: number, material: Material) => void;
  onRemoveMaterial: (itemId: number, recipeId: number) => void;
  onItemDelete: (itemId: number) => void;
}) {
  return (
    <Card className="mb-4 overflow-hidden border-none shadow-md">
      <Accordion type="single" collapsible>
        <AccordionItem value={`item-${item.id}`} className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/10 transition-colors">
            <div className="flex justify-between w-full pr-6 items-center">
              <div className="text-left">
                <h3 className="text-lg font-bold tracking-tight">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.recipes.length} Materials needed</p>
              </div>
              <div className="flex items-center gap-4 min-w-[140px]">
                <span className="text-sm font-black">{Math.round(item.percentageComplete || 0)}%</span>
                <Progress value={item.percentageComplete} className="h-2 flex-1"/>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-3">
              {item.recipes.map((recipe) => (
                <RecipeRow 
                  key={recipe.id} 
                  recipe={recipe} 
                  onUpdate={(rId: number, val: string) => onRecipeUpdate(item.id, rId, val)}
                  onUpdateGoal={(rId, val) => onGoalUpdate(item.id, rId, val)} // Pass it down
                  onRemoveMaterial={() => onRemoveMaterial(item.id, recipe.id)}
                />
              ))}
              <div className="pt-2 flex justify-center border-t border-dashed mt-4">
                  <AddMaterialModal 
                      allMaterials={allMaterials}
                      existingIds={item.recipes.map(r => r.materialId)}
                      onSelect={(material) => onAddMaterial(item.id, material)}
                  />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mx-4 text-muted-foreground hover:text-destructive transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the accordion from toggling
            onItemDelete(item.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Accordion>
    </Card>
  );
}