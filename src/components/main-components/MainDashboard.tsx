// MainDashboard.tsx
'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateQuantityOwned } from "@/app/services/actions";
import { TaskCard } from "./main-dashboard-components/TaskCard";
import { FullItem, FullTask } from "@/app/repository/dtos";
import { useRouter } from 'next/navigation';
import { deleteTask, getAllTasks } from "@/app/repository/maindbrepo";

export default function MainDashboard() {
  const [localTasks, setLocalTasks] = useState<FullTask[]>([]);
  const [errorText, setErrorText] = useState<string>("");

  const router = useRouter();

  const routerPush = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const initPage = async () => {
      setLocalTasks(await getAllTasks());
    }
    initPage();
  }, [])

  

  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorText(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [errorText]);

  const handleUpdate = (taskId: number, itemId: number, recipeId: number, val: string) => {
    const isNumeric = (str: string) => {
      if (typeof str != "string" || str.trim() === "") return false
      return Number.isFinite(Number(str));
    }
    if (!isNumeric(val)) return;
    const num = Number(val);
    if (isNaN(num) || num < 0) return;
    const maxQuantity = localTasks.find(t => t.id === taskId)?.items.find(i => i.id === itemId)?.recipes.find(r => r.id === recipeId)?.quantity || 0;
    if (num > maxQuantity) {
      handleUpdate(taskId, itemId, recipeId, maxQuantity.toString());
      setErrorText(`Quantity cannot exceed ${maxQuantity}.`);
      return;
    }

    updateQuantityOwned(recipeId, num);

    setLocalTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        items: t.items.map(i => {
          if (i.id !== itemId) return i;
          const newRecipe = i.recipes.map(r => r.id === recipeId ? { ...r, quantityOwned: num } : r);
          const needed = newRecipe.reduce((s, r) => s + r.quantity, 0);
          const owned = newRecipe.reduce((s, r) => s + r.quantityOwned, 0);
          return { ...i, recipes: newRecipe, percentageComplete: needed > 0 ? (owned / needed) * 100 : 0 };
        })
      };
    }));
  };

  const onAddItem = (taskId: number, item: FullItem) => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, items: [...t.items, item] };
    }));
  };

  const onItemRemove = (taskId: number, item: FullItem) => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, items: t.items.filter(i => i.id !== item.id) };
    }));
  };

  const onTaskRemove = async (taskId: number) => {
    console.log("Made it into function")
    setLocalTasks((prev) => {
      const newTasks = prev.map((task) => {
        if (task.id !== taskId) return task
      });
      return newTasks.filter(task => task !== undefined);
    })
    await deleteTask(taskId);
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white">Project Tracker</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => routerPush("/items")}>Items</Button>
          <Button variant="secondary" size="sm" onClick={() => routerPush("/materials")}>Materials</Button>
          <Button variant="secondary" size="sm" onClick={() => routerPush("/tasks/create")}>New Task</Button>
        </div>
      </header>
      <div className="text-sm text-red-500">{errorText}</div>
        <div className="grid gap-6">
          {localTasks.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={handleUpdate} onAddItem={onAddItem} onItemRemove={onItemRemove} onTaskRemove={onTaskRemove} />
          ))}
        </div>
    </div>
  );
}