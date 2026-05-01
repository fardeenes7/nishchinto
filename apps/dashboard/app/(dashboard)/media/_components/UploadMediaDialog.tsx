"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { MediaUploader } from "@/components/MediaUploader";

interface UploadMediaDialogProps {
    shopId: string;
}

export function UploadMediaDialog({ shopId }: UploadMediaDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleUploadSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                    <Plus size={16} />
                    Upload Media
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Upload Media</DialogTitle>
                    <DialogDescription>
                        Drag and drop images here to upload to your media gallery. Allowed formats: JPG, PNG, WEBP, GIF.
                    </DialogDescription>
                </DialogHeader>
                <MediaUploader 
                    shopId={shopId} 
                    onUploadSuccess={handleUploadSuccess} 
                    maxFiles={20}
                />
            </DialogContent>
        </Dialog>
    );
}
