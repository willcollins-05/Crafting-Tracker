import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FullItem } from "@/app/repository/dtos";
import { getAllItemsNotInAnyTask } from "@/app/repository/maindbrepo";

interface AddItemModalProps {
    existingItemIds: number[];
    onAdd: (item: FullItem) => void;
    onAddItem: (item: FullItem) => void;
}

export function AddItemModal({ existingItemIds, onAdd, onAddItem }: AddItemModalProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [allItemsNotInTasks, setAllItemsNotInTasks] = useState<FullItem[]>([]);

    useEffect(() => {
      getAllItemsNotInAnyTask().then(items => {
          setAllItemsNotInTasks(items);
      })
    }, [open]);

    const handleSelect = (item: FullItem) => {
        onAdd(item);
        onAddItem(item);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hover:bg-gray-200 hover:text-slate-800">
            <span className="">+ Add Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item to Task</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {allItemsNotInTasks.length > 0 ? (
              allItemsNotInTasks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-secondary/50"
                >
                  <span className="font-medium">{item.name}</span>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                No items found.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
    )
}
