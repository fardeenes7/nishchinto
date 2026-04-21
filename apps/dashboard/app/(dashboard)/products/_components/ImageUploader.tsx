"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import {
  IconUpload,
  IconX,
  IconGripVertical,
  IconPhoto,
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
import { Spinner } from "@repo/ui/components/ui/spinner";
import { cn } from "@repo/ui/lib/utils";
import {
  getPresignedUploadUrl,
  confirmUpload,
} from "@/lib/api";
import { uploadFileToS3 } from "@/lib/upload";
import type { MediaRecord } from "@repo/api";


interface UploadedImage {
  id: string;
  cdnUrl: string;
  filename: string;
  status: "uploading" | "processing" | "done" | "error";
}

interface ImageUploaderProps {
  shopId: string;
  value: string[]; // media IDs
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
      className="relative size-24 rounded-lg border overflow-hidden group"
    >
      {image.status === "uploading" || image.status === "processing" ? (
        <div className="size-full flex items-center justify-center bg-muted">
          <Spinner className="size-5" />
        </div>
      ) : image.status === "error" ? (
        <div className="size-full flex items-center justify-center bg-destructive/10">
          <span className="text-xs text-destructive">Error</span>
        </div>
      ) : (
        <Image
          src={image.cdnUrl}
          alt={image.filename}
          fill
          className="object-cover"
        />
      )}

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-0.5"
      >
        <IconGripVertical className="size-3 text-white" />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-0.5 text-white hover:bg-destructive"
      >
        <IconX className="size-3" />
      </button>
    </div>
  );
}

export function ImageUploader({
  shopId,
  value,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = async (file: File) => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const previewUrl = URL.createObjectURL(file);

    setUploadedImages((prev) => [
      ...prev,
      {
        id: tempId,
        cdnUrl: previewUrl,
        filename: file.name,
        status: "uploading",
      },
    ]);

    try {
      // Step 1: Get presigned URL
      const urlRes = await getPresignedUploadUrl(
        file.name,
        file.type,
        shopId,
      );
      if (!urlRes.success) throw new Error(urlRes.error);

      const { upload_url, s3_key } = urlRes.data;

      // Step 2: Upload directly to S3/MinIO
      const uploadRes = await uploadFileToS3(upload_url, file);
      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      // Step 3: Confirm upload (triggers WebP conversion)
      const confirmRes = await confirmUpload(s3_key, file.name, shopId);
      if (!confirmRes.success) throw new Error(confirmRes.error);

      const media = confirmRes.data;

      // Update the temp entry with real media data
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === tempId
            ? {
                id: media.id,
                cdnUrl: media.cdn_url || previewUrl,
                filename: file.name,
                status: "processing",
              }
            : img,
        ),
      );

      // Add the real media ID to the form value
      onChange([...value, media.id]);

      // Poll for WebP completion (simple polling, 5s intervals, max 30s)
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts >= 6) {
          clearInterval(pollInterval);
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === media.id ? { ...img, status: "done" } : img,
            ),
          );
          return;
        }
        // In production, we'd poll GET /api/v1/media/{id}/
        // For now, just mark done after first interval
        clearInterval(pollInterval);
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === media.id ? { ...img, status: "done" } : img,
          ),
        );
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === tempId ? { ...img, status: "error" } : img,
        ),
      );
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedImages.length + acceptedFiles.length > maxImages) {
        toast.error(`You can upload a maximum of ${maxImages} images.`);
        return;
      }
      setIsUploading(true);
      await Promise.all(acceptedFiles.map(processFile));
      setIsUploading(false);
    },
    [uploadedImages.length, maxImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    maxSize: 5 * 1024 * 1024, // 5 MB — matches backend rule
    disabled: isUploading || uploadedImages.length >= maxImages,
  });

  const handleRemove = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    onChange(value.filter((v) => v !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = uploadedImages.findIndex((img) => img.id === active.id);
      const newIndex = uploadedImages.findIndex((img) => img.id === over.id);
      const newOrder = arrayMove(uploadedImages, oldIndex, newIndex);
      setUploadedImages(newOrder);
      onChange(newOrder.map((img) => img.id).filter((id) => value.includes(id)));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Preview grid */}
      {uploadedImages.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={uploadedImages.map((img) => img.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Drop zone */}
      {uploadedImages.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
            isUploading && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Spinner className="size-8 text-muted-foreground" />
            ) : (
              <div className="rounded-full bg-muted p-3">
                {isDragActive ? (
                  <IconPhoto className="size-6 text-primary" />
                ) : (
                  <IconUpload className="size-6 text-muted-foreground" />
                )}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop images here"
                  : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, GIF, WebP — max 5 MB each
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
