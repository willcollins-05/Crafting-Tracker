'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddMaterialModal } from '@/components/main-components/CreateItem/AddMaterialModal';
import { getAllMaterials, createFullItem } from '@/app/repository/maindbrepo'; 
import { Material } from '@/types/dbtypes';

interface RecipeDraft {
  materialId: number;
  name: string;
  quantity: number;
}

export default function CreateItemPage() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [recipe, setRecipe] = useState<RecipeDraft[]>([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);

  useEffect(() => {
    getAllMaterials().then(setAllMaterials);
  }, []);

  const addMaterialToRecipe = (m: Material) => {
    setRecipe([...recipe, { materialId: m.id, name: m.name, quantity: 1 }]);
  };

  const updateQuantity = (id: number, val: string) => {
    const q = parseInt(val) || 0;
    setRecipe(recipe.map(r => r.materialId === id ? { ...r, quantity: q } : r));
  };

  const removeMaterial = (id: number) => {
    setRecipe(recipe.filter(r => r.materialId !== id));
  };

  const handleSave = async () => {
    if (!itemName || recipe.length === 0) return alert("Please add a name and at least one material.");
    
    // Call your repo function to insert the item and its recipe rows
    await createFullItem(itemName, recipe);
    router.push('/items'); // Redirect back to items list
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-3">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Create New Item</h1>
          <p className="text-muted-foreground">Define a new item and its required materials.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Item Name" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="text-lg font-semibold"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recipe</CardTitle>
            <AddMaterialModal 
              allMaterials={allMaterials} 
              existingIds={recipe.map(r => r.materialId)}
              onSelect={addMaterialToRecipe} 
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipe.map((row) => (
                <div key={row.materialId} className="flex items-center gap-4 p-3 border rounded-lg bg-secondary/10">
                  <div className="flex-1">
                    <p className="text-sm font-bold">{row.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {row.materialId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Qty:</span>
                    <Input 
                      type="number" 
                      className="w-20 h-8" 
                      value={row.quantity} 
                      onChange={(e) => updateQuantity(row.materialId, e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeMaterial(row.materialId)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {recipe.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6 border-2 border-dashed rounded-lg">
                  No materials added to this recipe yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button className="w-full py-6 text-lg" onClick={handleSave} disabled={!itemName || recipe.length === 0}>
          <Save className="mr-2 h-5 w-5" /> Save Item
        </Button>
      </div>
    </div>
  );
}