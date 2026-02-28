'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddItemModal } from '@/components/main-components/main-dashboard-components/AddItemModal'; 
import { getAllItems, createFullTask } from '@/app/repository/maindbrepo'; 
import { FullItem } from '@/app/repository/dtos';

export default function CreateTaskPage() {
  const router = useRouter();
  const [taskName, setTaskName] = useState("");
  const [itemsInTask, setItemsInTask] = useState<FullItem[]>([]);
  const [masterItemList, setMasterItemList] = useState<FullItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch all existing items to populate the Modal
  useEffect(() => {
    getAllItems().then(setMasterItemList);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000)
  }, [errorMessage])

  const handleAddItem = (item: FullItem) => {
    if (itemsInTask.find((i) => i.id === item.id) === undefined) {
      setItemsInTask((prev) => [...prev, item]);
    } else {
      setErrorMessage("Cannot add item twice.");
    }
  };

  const handleOnAddItem = (item: FullItem) => {
    return;
  }

  const handleRemoveItem = (itemId: number) => {
    setItemsInTask((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleSave = async () => {
    if (!taskName.trim() || itemsInTask.length === 0) return;
    
    setIsSaving(true);
    try {
      // Logic to save task and the junction table entries
      await createFullTask(taskName, itemsInTask.map(i => i.id));
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      console.error("Failed to save task", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-3 text-muted-foreground">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black tracking-tight">Create New Task</h1>
          </div>
          <p className="text-muted-foreground">Group items together into a trackable objective.</p>
        </header>

        {/* Task Name Input */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Task Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Task Name" 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="text-lg font-semibold h-12"
            />
          </CardContent>
        </Card>

        {/* Item Selection Area */}
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Included Items</CardTitle>
            <AddItemModal 
              existingItemIds={itemsInTask.map(i => i.id)}
              onAdd={handleAddItem}
              onAddItem={handleOnAddItem}
            />
          </CardHeader>
          {errorMessage !== "" && (
              <div className="text-sm text-red-500 mx-4">{errorMessage}</div>
          )}
          <CardContent className="p-0">
            <div className="divide-y">
              {itemsInTask.length > 0 ? (
                itemsInTask.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <Box className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.recipes.length} materials in recipe</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No items added to this task yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full py-6 text-lg font-bold shadow-lg" 
          onClick={handleSave} 
          disabled={!taskName.trim() || itemsInTask.length === 0 || isSaving}
        >
          {isSaving ? "Saving Task..." : "Save Project Task"}
        </Button>
      </div>
    </div>
  );
}