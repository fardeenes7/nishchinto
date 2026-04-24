"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { IconDeviceFloppy, IconLayoutSidebar, IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react";
import { updateStoreTheme } from "@/lib/api";
import { toast } from "sonner";

interface ThemeProps {
    id?: string;
    theme_id: string;
    aesthetic_overrides: any;
    active_components: any;
    typography: any;
}

export function BuilderWorkspace({ initialTheme }: { initialTheme: ThemeProps | null }) {
    const [theme, setTheme] = useState<ThemeProps>(initialTheme || {
        theme_id: "minimalist",
        aesthetic_overrides: {},
        active_components: {
            header: "classic",
            hero: "split_media",
            product_showcase: "grid",
            pdp: "standard",
            footer: "simple"
        },
        typography: {
            heading: "Inter",
            body: "Inter"
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateStoreTheme(theme);
            if (res.success) {
                toast.success("Theme saved successfully");
            } else {
                toast.error(res.error || "Failed to save theme");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const updateComponent = (key: string, value: string) => {
        setTheme(prev => ({
            ...prev,
            active_components: {
                ...prev.active_components,
                [key]: value
            }
        }));
    };

    return (
        <div className="flex h-full w-full overflow-hidden border rounded-lg bg-background">
            {/* Left Sidebar - Configuration */}
            <div className="w-80 flex-shrink-0 border-r flex flex-col bg-muted/30">
                <div className="p-4 border-b flex items-center justify-between bg-background">
                    <h2 className="font-semibold flex items-center gap-2">
                        <IconLayoutSidebar className="size-5" />
                        Theme Editor
                    </h2>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        <IconDeviceFloppy className="size-4 mr-2" />
                        Save
                    </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Base Theme</h3>
                        <Select value={theme.theme_id} onValueChange={(v) => setTheme({ ...theme, theme_id: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="minimalist">Minimalist</SelectItem>
                                <SelectItem value="bold_tech">Bold & Tech</SelectItem>
                                <SelectItem value="soft_elegance">Soft Elegance</SelectItem>
                                <SelectItem value="urban_streetwear">Urban Streetwear</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Section Layouts */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Sections</h3>
                        
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Header</label>
                            <Select value={theme.active_components.header} onValueChange={(v) => updateComponent('header', v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="classic">Classic Navigation</SelectItem>
                                    <SelectItem value="minimal">Minimal (Hamburger)</SelectItem>
                                    <SelectItem value="center_logo">Center Logo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Hero Section</label>
                            <Select value={theme.active_components.hero} onValueChange={(v) => updateComponent('hero', v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="split_media">Split Media</SelectItem>
                                    <SelectItem value="full_overlay">Full Overlay</SelectItem>
                                    <SelectItem value="minimal_typography">Minimal Typography</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Product Showcase</label>
                            <Select value={theme.active_components.product_showcase} onValueChange={(v) => updateComponent('product_showcase', v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">Standard Grid</SelectItem>
                                    <SelectItem value="masonry">Masonry Layout</SelectItem>
                                    <SelectItem value="carousel">Horizontal Carousel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Product Details Page (PDP)</label>
                            <Select value={theme.active_components.pdp} onValueChange={(v) => updateComponent('pdp', v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard Split</SelectItem>
                                    <SelectItem value="sticky">Sticky Info</SelectItem>
                                    <SelectItem value="minimal">Express/Minimal Focus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Footer</label>
                            <Select value={theme.active_components.footer} onValueChange={(v) => updateComponent('footer', v)}>
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="simple">Simple</SelectItem>
                                    <SelectItem value="expanded">Expanded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area - Preview */}
            <div className="flex-1 flex flex-col bg-muted/10">
                <div className="h-14 border-b flex items-center justify-center gap-2 bg-background">
                    <Button 
                        variant={previewMode === "desktop" ? "secondary" : "ghost"} 
                        size="icon" 
                        className="size-8"
                        onClick={() => setPreviewMode("desktop")}
                    >
                        <IconDeviceDesktop className="size-4" />
                    </Button>
                    <Button 
                        variant={previewMode === "mobile" ? "secondary" : "ghost"} 
                        size="icon" 
                        className="size-8"
                        onClick={() => setPreviewMode("mobile")}
                    >
                        <IconDeviceMobile className="size-4" />
                    </Button>
                </div>
                
                <div className="flex-1 p-8 flex items-center justify-center overflow-auto bg-[url('/grid.svg')] bg-center">
                    <div 
                        className={`bg-background border shadow-xl rounded-md overflow-hidden transition-all duration-300 ${
                            previewMode === "desktop" ? "w-full max-w-5xl h-full" : "w-[375px] h-[812px]"
                        }`}
                    >
                        {/* Placeholder for iframe / preview engine */}
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                            <IconDeviceDesktop className="size-16 opacity-20 mb-4" />
                            <p>Storefront Preview Engine</p>
                            <p className="text-sm opacity-60">
                                Theme: {theme.theme_id} | Header: {theme.active_components.header}
                            </p>
                            <p className="text-xs opacity-40 mt-4 max-w-sm text-center">
                                In production, this pane dynamically renders the Next.js Storefront BlockRenderer via iframe, instantly reflecting theme overrides.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
