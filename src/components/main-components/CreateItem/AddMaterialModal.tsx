import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import { Material } from "@/types/dbtypes";

interface Props {
  allMaterials: Material[];
  existingIds: number[];
  onSelect: (material: Material) => void;
}

export function AddMaterialModal({ allMaterials, existingIds, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const available = allMaterials.filter(
    (m) => !existingIds.includes(m.id) && m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Material</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search materials..." 
            className="pl-9" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <ScrollArea className="h-72">
          <div className="space-y-2">
            {available.map((m) => (
              <div 
                key={m.id} 
                className="flex items-center justify-between p-2 border rounded-md hover:bg-secondary/50 cursor-pointer"
                onClick={() => { onSelect(m); setOpen(false); }}
              >
                <span className="text-sm font-medium">{m.name}</span>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}