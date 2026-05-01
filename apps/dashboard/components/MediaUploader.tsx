"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import {
    UploadCloud,
    X,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { getPresignedUploadUrl, confirmUpload } from "@/lib/api";
import { uploadFileToS3 } from "@/lib/upload";
import { Button } from "@repo/ui/components/ui/button";
import { Progress } from "@repo/ui/components/ui/progress";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MediaUploaderProps {
    shopId: string;
    onUploadSuccess?: (mediaArray: any[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
}

type UploadStatus = "idle" | "thumbnailing" | "uploading" | "success" | "error";

interface UploadFile {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: UploadStatus;
    errorMessage?: string;
    mediaData?: any;
}

const generateThumbnail = (
    file: File,
    maxSize: number = 1080
): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Skip GIF to keep animation
        if (file.type === "image/gif") {
            return resolve(file);
        }

        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(file);

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return resolve(file);
                    const newFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(newFile);
                },
                file.type,
                0.85
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file); // fallback to original if error
        };

        img.src = objectUrl;
    });
};

export function MediaUploader({
    shopId,
    onUploadSuccess,
    maxFiles = 10,
    maxSizeMB = 5
}: MediaUploaderProps) {
    const { refresh } = useRouter();
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                fileRejections.forEach(({ file, errors }) => {
                    toast.error(
                        `${file.name} was rejected: ${errors[0]?.message}`
                    );
                });
            }

            if (acceptedFiles.length === 0) return;

            const newFiles = acceptedFiles.map((file) => ({
                id: Math.random().toString(36).substring(7),
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
                status: "idle" as UploadStatus
            }));

            setFiles((prev) => [...prev, ...newFiles]);
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"]
        },
        maxSize: maxSizeMB * 1024 * 1024,
        maxFiles
    });

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const file = prev.find((f) => f.id === id);
            if (file?.preview) URL.revokeObjectURL(file.preview);
            return prev.filter((f) => f.id !== id);
        });
    };

    const updateFileState = (id: string, updates: Partial<UploadFile>) => {
        setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
        );
    };

    const handleUpload = async () => {
        const filesToUpload = files.filter(
            (f) => f.status === "idle" || f.status === "error"
        );
        if (filesToUpload.length === 0) return;

        setIsUploading(true);
        const successfulUploads: any[] = [];

        for (const fileObj of filesToUpload) {
            try {
                // 1. Generate Thumbnail
                updateFileState(fileObj.id, {
                    status: "thumbnailing",
                    progress: 10
                });
                const processedFile = await generateThumbnail(fileObj.file);

                updateFileState(fileObj.id, {
                    status: "uploading",
                    progress: 30
                });

                // 2. Get Presigned URL
                const urlRes = await getPresignedUploadUrl(
                    processedFile.name,
                    processedFile.type,
                    shopId
                );

                if (!urlRes.success || !urlRes.data) {
                    throw new Error(
                        !urlRes.success
                            ? urlRes.error
                            : "Failed to get upload URL"
                    );
                }

                updateFileState(fileObj.id, { progress: 50 });

                // 3. Upload to S3
                const { upload_url, s3_key } = urlRes.data;
                const s3Res = await uploadFileToS3(upload_url, processedFile);

                if (!s3Res.ok) {
                    throw new Error("Failed to upload to storage");
                }

                updateFileState(fileObj.id, { progress: 80 });

                // 4. Confirm Upload
                const confirmRes = await confirmUpload(
                    s3_key,
                    fileObj.file.name,
                    shopId
                );

                if (!confirmRes.success) {
                    throw new Error(
                        !confirmRes.success
                            ? confirmRes.error
                            : "Failed to confirm upload"
                    );
                }

                updateFileState(fileObj.id, {
                    status: "success",
                    progress: 100,
                    mediaData: confirmRes.data
                });
                successfulUploads.push(confirmRes.data);
            } catch (error: any) {
                console.error("Upload error:", error);
                updateFileState(fileObj.id, {
                    status: "error",
                    errorMessage: error.message || "Upload failed"
                });
                toast.error(`Failed to upload ${fileObj.file.name}`);
            }
        }

        setIsUploading(false);
        if (successfulUploads.length > 0 && onUploadSuccess) {
            onUploadSuccess(successfulUploads);
            toast.success(
                `Successfully uploaded ${successfulUploads.length} file(s)`
            );
        }
        refresh();
    };

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            files.forEach((f) => {
                if (f.preview) URL.revokeObjectURL(f.preview);
            });
        };
    }, []);

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                    Drag & drop media here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    or click to select files (Max {maxSizeMB}MB each)
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                >
                    Select Files
                </Button>
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                            Selected Files ({files.length})
                        </h4>
                        <div className="space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFiles([])}
                                disabled={isUploading}
                            >
                                Clear All
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUpload}
                                disabled={
                                    isUploading ||
                                    files.every((f) => f.status === "success")
                                }
                            >
                                {isUploading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Upload Files
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-72 border rounded-md p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="relative group border rounded-lg overflow-hidden flex flex-col bg-card"
                                >
                                    <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={fileObj.preview}
                                            alt={fileObj.file.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {fileObj.status === "idle" &&
                                            !isUploading && (
                                                <button
                                                    onClick={() =>
                                                        removeFile(fileObj.id)
                                                    }
                                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        {fileObj.status === "success" && (
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                                                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                                                <span className="text-sm font-medium">
                                                    Uploaded
                                                </span>
                                            </div>
                                        )}
                                        {fileObj.status === "error" && (
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                                                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                                                <span className="text-sm font-medium">
                                                    Failed
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 text-xs flex flex-col gap-2">
                                        <div className="flex justify-between items-center truncate">
                                            <span
                                                className="truncate font-medium"
                                                title={fileObj.file.name}
                                            >
                                                {fileObj.file.name}
                                            </span>
                                            <span className="text-muted-foreground ml-2 shrink-0">
                                                {(
                                                    fileObj.file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </span>
                                        </div>
                                        {(fileObj.status === "uploading" ||
                                            fileObj.status ===
                                                "thumbnailing") && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                                    <span>
                                                        {fileObj.status ===
                                                        "thumbnailing"
                                                            ? "Processing..."
                                                            : "Uploading..."}
                                                    </span>
                                                    <span>
                                                        {fileObj.progress}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={fileObj.progress}
                                                    className="h-1"
                                                />
                                            </div>
                                        )}
                                        {fileObj.status === "error" && (
                                            <p
                                                className="text-destructive truncate"
                                                title={fileObj.errorMessage}
                                            >
                                                {fileObj.errorMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
