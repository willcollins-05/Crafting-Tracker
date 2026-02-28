'use client'
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion } from "@/components/ui/accordion";
import { FullItem } from "@/app/repository/dtos";
import { ItemAccordion } from "./ItemAccordion";
import { FullTask } from "@/app/repository/dtos";
import { Button } from "@/components/ui/button";
import { AddItemModal } from "./AddItemModal";
import { addExistingItemToTask, removeItemFromTask } from "@/app/repository/maindbrepo";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: FullTask;
  onUpdate: (taskId: number, itemId: number, recipeId: number, val: string) => void;
  onAddItem: (taskId: number, item: FullItem) => void;
  onItemRemove: (taskId: number, item: FullItem) => void;
  onTaskRemove: (taskId: number) => void;
}

export function TaskCard({ task, onUpdate, onAddItem, onItemRemove, onTaskRemove }: TaskCardProps) {
  const taskPercent = task.items.length > 0 
    ? task.items.reduce((acc, i) => acc + (i.percentageComplete || 0), 0) / task.items.length 
    : 0;

  const handleAddItem = async (item: FullItem) => {
    await addExistingItemToTask(task.id, item.id);
    
    onUpdate(task.id, item.id, 0, "0");
  }

  const handleUpdate = (item: FullItem) => {
    onAddItem(task.id, item);
  }

  const onRemoveItem = (item: FullItem) => {
    removeItemFromTask(item.id);
    onUpdate(task.id, item.id, 0, "0");
    onItemRemove(task.id, item);
  }

  useEffect(() => {
    task.items.forEach((item) => {
      item.recipes.forEach((recipe) => {
        onUpdate(task.id, item.id, recipe.id, String(recipe.quantityOwned));
      })
    })
  }, [])
    

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-black uppercase tracking-tight">
            {task.name}
          </CardTitle>
          <div className="flex">
            <div className="flex items-center gap-4 min-w-[180px]">
              <span className="text-xs font-bold uppercase">{Math.round(taskPercent)}% Done</span>
              <Progress value={taskPercent} className="h-2.5 flex-1" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation(); 
                onTaskRemove(task.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className='flex justify-between items-center border-b'>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-4 pt-4">Items</span>
          </div>
          <div className="mx-4 mt-2 mb-2 rounded-md px-1 transition-colors">
            <AddItemModal 
              existingItemIds={task.items.map(i => i.id)}
              onAdd={handleAddItem}
              onAddItem={handleUpdate}
            />
          </div>
        </div>
        <Accordion type="multiple" className="w-full">
          {task.items.map((item) => (
            <ItemAccordion 
              key={item.id} 
              item={item} 
              onMaterialChange={(itemId, rId, val) => onUpdate(task.id, itemId, rId, val)} 
              onRemoveItem={onRemoveItem}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}