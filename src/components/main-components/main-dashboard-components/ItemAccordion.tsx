import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Item } from "@/types/dbtypes";
import { MaterialRow } from "./MaterialRow";
import { FullItem } from "@/app/repository/dtos";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ItemAccordionProps {
  item: FullItem;
  onMaterialChange: (itemId: number, recipeId: number, value: string) => void;
  onRemoveItem: (item: FullItem) => void;
}

export function ItemAccordion({ item, onMaterialChange, onRemoveItem }: ItemAccordionProps) {
  return (
    <AccordionItem value={`item-${item.id}`} className="px-4 border-b last:border-0">
      <div className="flex items-center justify-between gap-2 w-full">

        <AccordionTrigger className="hover:no-underline py-4 flex-1 w-full">
          <div className="w-full pr-4 items-between">
            <span className="text-sm font-semibold">{item.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {Math.round(item.percentageComplete || 0)}%
              </span>
              <Progress value={item.percentageComplete} className="w-20 h-1.5" />
            </div>
          </div>
        </AccordionTrigger>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors shrink-0"
          onClick={(e) => {
            // No preventDefault needed here since we are not inside a button
            onRemoveItem(item);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <AccordionContent>
        <div className="space-y-2 pb-2">
          <div className="grid grid-cols-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-2">
            <span>Material</span>
            <span>Target</span>
            <span>Owned</span>
            <span className="text-right">Progress</span>
          </div>
          { item.recipes === null || item.recipes === undefined ?  <div className="text-center py-2 text-sm text-muted-foreground">No materials to display</div> : item.recipes.map((rec) => (
            <MaterialRow 
              key={rec.id} 
              recipe={rec} 
              onQuantityChange={(rId, val) => onMaterialChange(item.id, rId, val)} 
            />
          ))}
          {}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}