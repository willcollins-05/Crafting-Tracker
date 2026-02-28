'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Boxes, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Material } from '@/types/dbtypes';
import { getAllMaterials, deleteMaterial } from '../repository/maindbrepo';
import { MaterialCard } from '@/components/main-components/MaterialDetail/MaterialCard';

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    useEffect(() => {
        getAllMaterials().then(data => {
            setMaterials(data);
            setIsLoading(false);
        });
    }, []);

    const routerPush = (path: string) => {
        router.push(path);
    };

    // Filter materials based on search input
    const filteredMaterials = materials.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.id.toString().includes(searchQuery)
    );

    const onRemove = (materialId: number) => {
        setMaterials((prev) => {
            const newMaterials = prev.map((mat) => {
                if (mat.id !== materialId) return mat
            });
            return newMaterials.filter((m) => m !== undefined)
        });
        
        deleteMaterial(materialId);
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => routerPush("/")} 
                    className="group w-fit -ml-3 text-muted-foreground"
                >
                    <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Boxes className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-black tracking-tight">Materials</h1>
                        </div>
                        <p className="text-muted-foreground">Reference list of all available crafting components.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search materials..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="bg-primary hover:bg-primary/80 rounded-md px-3 py-1 text-sm text-white transition-colors">
                            <Button onClick={() => routerPush("/materials/create")} size="sm" className="bg-transparent hover:bg-transparent">
                                <span className="bg-transparent">+ Add Material</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                </div>
            ) : filteredMaterials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterials.map(material => (
                        <MaterialCard key={material.id} material={material} onRemove={onRemove} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                    <p className="text-muted-foreground text-sm">No materials match your search.</p>
                    <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="mt-2"
                    >
                        Clear Search
                    </Button>
                </div>
            )}
        </div>
    );
}