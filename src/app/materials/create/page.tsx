'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, PlusCircle, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { addNewMaterial } from '@/app/repository/maindbrepo'; // You'll create this server action

export default function CreateMaterialPage() {
  const router = useRouter();
  const [materialName, setMaterialName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) return;

    setIsSubmitting(true);
    try {
      await addNewMaterial(materialName.trim());

      setMaterialName(""); // Clear input for next entry
      router.push("/materials")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6">
      {/* Navigation */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.back()} 
        className="group -ml-3 mb-6 text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>

      <div className="space-y-6">
        <header>
          <div className="flex items-center gap-2 mb-1">
            <PlusCircle className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">New Material</h1>
          </div>
          <p className="text-muted-foreground">
            Add a new base component to use in item recipes.
          </p>
        </header>

        <form onSubmit={handleSave}>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Material Information
              </CardTitle>
              <CardDescription>
                Base materials are shared across all item recipes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Material Name" 
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="text-lg py-6 focus-visible:ring-primary"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-bold" 
                disabled={!materialName.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Create Material
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}