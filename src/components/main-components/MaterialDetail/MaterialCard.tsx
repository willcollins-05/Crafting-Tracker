import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Trash2 } from "lucide-react";
import { Material } from "@/types/dbtypes";
import { Button } from "@/components/ui/button";

export function MaterialCard({ material, onRemove }: { material: Material, onRemove: (materialId: number) => void}) {
  return (
    <Card className="hover:border-primary/50 transition-colors shadow-sm">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4 p-4">
        <div className="bg-secondary p-2 rounded-lg">
          <Package2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <CardTitle className="text-sm font-bold leading-none">
            {material.name}
          </CardTitle>
          <span className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">
            Material ID: {material.id}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation(); 
            onRemove(material.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
    </Card>
  );
}