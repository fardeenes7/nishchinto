import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table";
import { Badge } from "@repo/ui/components/ui/badge";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

const MOCK_PRODUCTS = [
    { id: "1", sku: "TSHIRT-01", name: "Classic T-Shirt", price: "500.00", stock: 45, status: "PUBLISHED" },
    { id: "2", sku: "TSHIRT-02", name: "V-Neck T-Shirt", price: "550.00", stock: 12, status: "PUBLISHED" },
    { id: "3", sku: "HOODIE-01", name: "Winter Hoodie", price: "1200.00", stock: 0, status: "DRAFT" },
    { id: "4", sku: "CAP-01", name: "Baseball Cap", price: "300.00", stock: 150, status: "PUBLISHED" },
];

export default function BulkProductEditorPage() {
    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/products" className="text-muted-foreground hover:text-foreground">
                            <IconArrowLeft className="size-4" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Bulk Editor</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Mass-edit prices, stock quantities, and status for your products.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Discard Changes</Button>
                    <Button>
                        <IconDeviceFloppy className="size-4 mr-2" />
                        Save All
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">SKU</TableHead>
                            <TableHead className="min-w-[200px]">Product Name</TableHead>
                            <TableHead className="w-[150px]">Base Price (BDT)</TableHead>
                            <TableHead className="w-[120px]">Stock</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_PRODUCTS.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Input 
                                        defaultValue={product.price} 
                                        type="number" 
                                        className="h-8 w-full"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        defaultValue={product.stock} 
                                        type="number" 
                                        className="h-8 w-full"
                                    />
                                </TableCell>
                                <TableCell>
                                    <select 
                                        className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        defaultValue={product.status}
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
