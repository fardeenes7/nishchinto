"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  IconPlus,
  IconX,
  IconGripVertical,
} from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

interface UploadedImage {
  id: string;
  cdnUrl: string;
  filename: string;
  status: "uploading" | "processing" | "done" | "error";
}

interface ImageUploaderProps {
  shopId: string;
  value: string[]; // media IDs
  initialImages?: UploadedImage[];
  onChange: (ids: string[]) => void;
  maxImages?: number;
}

function SortableImage({
  image,
  onRemove,
}: {
  image: UploadedImage;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative size-24 rounded-md border overflow-hidden group bg-muted/30 shadow-sm"
    >
      <Image
        src={image.cdnUrl}
        alt={image.filename}
        fill
        className="object-cover"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-1"
      >
        <IconGripVertical className="size-3 text-white" />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-1 text-white hover:bg-destructive"
      >
        <IconX className="size-3" />
      </button>

      {/* Primary indicator */}
      <div className="absolute bottom-1 left-1 pointer-events-none">
          <div className="bg-primary/90 backdrop-blur-sm text-[8px] text-white px-1 py-0.5 rounded uppercase font-bold tracking-tighter opacity-0 group-first:opacity-100 transition-opacity">
              Primary
          </div>
      </div>
    </div>
  );
}

export function ImageUploader({
  shopId,
  value,
  initialImages,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize once on mount or when initialImages becomes available
  useEffect(() => {
    if (initialImages && !hasInitialized) {
      setUploadedImages(initialImages);
      setHasInitialized(true);
    }
  }, [initialImages, hasInitialized]);

  const handleUploadSuccess = (mediaArray: any[]) => {
      const newImages: UploadedImage[] = mediaArray.map(m => ({
          id: m.id,
          cdnUrl: m.cdn_url,
          filename: m.original_filename || "image",
          status: "done"
      }));

      const updatedList = [...uploadedImages, ...newImages];
      setUploadedImages(updatedList);
      onChange(updatedList.map(img => img.id));
      setIsDialogOpen(false);
  };

  const handleRemove = (id: string) => {
    const updated = uploadedImages.filter((img) => img.id !== id);
    setUploadedImages(updated);
    onChange(updated.map((img) => img.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = uploadedImages.findIndex((img) => img.id === active.id);
      const newIndex = uploadedImages.findIndex((img) => img.id === over.id);
      const newOrder = arrayMove(uploadedImages, oldIndex, newIndex);
      setUploadedImages(newOrder);
      onChange(newOrder.map((img) => img.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={uploadedImages.map((img) => img.id)}
            strategy={horizontalListSortingStrategy}
          >
            {uploadedImages.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onRemove={handleRemove}
              />
            ))}
          </SortableContext>
        </DndContext>

        {uploadedImages.length < maxImages && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="flex flex-col items-center justify-center size-24 rounded-md border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                        <div className="rounded-full bg-muted p-1.5 group-hover:bg-primary/10 transition-colors">
                            <IconPlus className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-[10px] font-medium mt-1 text-muted-foreground group-hover:text-primary transition-colors">Add Image</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Upload Product Images</DialogTitle>
                        <DialogDescription>
                            Upload high-quality images of your product. First image will be the primary thumbnail.
                        </DialogDescription>
                    </DialogHeader>
                    <MediaUploader 
                        shopId={shopId} 
                        onUploadSuccess={handleUploadSuccess} 
                        maxFiles={maxImages - uploadedImages.length}
                    />
                </DialogContent>
            </Dialog>
        )}
      </div>

      {uploadedImages.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No images added yet.</p>
      )}
    </div>
  );
}

