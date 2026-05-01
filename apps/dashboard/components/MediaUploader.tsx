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
import { IconPlus } from "@tabler/icons-react";

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
        <div
            {...getRootProps()}
            className={`space-y-4 outline-none min-h-[300px] transition-colors rounded-xl ${
                isDragActive && files.length > 0
                    ? "bg-primary/5 ring-2 ring-primary ring-inset"
                    : ""
            }`}
        >
            <input {...getInputProps()} />

            {files.length === 0 ? (
                <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive
                            ? "border-primary bg-primary/5 scale-[0.99]"
                            : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                >
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold mb-1">
                        Drag & drop media here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        or click to select files (Max {maxSizeMB}MB each)
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                    >
                        Select Files
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-semibold">
                                Selected Files
                            </h4>
                            <p className="text-[10px] text-muted-foreground">
                                {
                                    files.filter((f) => f.status === "success")
                                        .length
                                }{" "}
                                of {files.length} uploaded
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFiles([]);
                                }}
                                disabled={isUploading}
                            >
                                Clear All
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className="h-8 text-xs px-4 shadow-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpload();
                                }}
                                disabled={
                                    isUploading ||
                                    files.every((f) => f.status === "success")
                                }
                            >
                                {isUploading ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                ) : (
                                    <UploadCloud className="mr-2 h-3 w-3" />
                                )}
                                Start Upload
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-80 border rounded-xl bg-muted/20 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* The "Add More" Square */}
                            {!isUploading && (
                                <div className="aspect-square border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all group">
                                    <div className="rounded-full bg-muted group-hover:bg-primary/10 p-2 mb-2 transition-colors">
                                        <IconPlus className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        Add More
                                    </span>
                                </div>
                            )}

                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="relative group aspect-square border rounded-lg overflow-hidden flex flex-col bg-card shadow-sm"
                                >
                                    <div className="relative flex-1 bg-muted flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={fileObj.preview}
                                            alt={fileObj.file.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {fileObj.status === "idle" &&
                                            !isUploading && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(fileObj.id);
                                                    }}
                                                    className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        {fileObj.status === "success" && (
                                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                                                <div className="bg-white rounded-full p-1 mb-1 shadow-lg">
                                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
                                                    Done
                                                </span>
                                            </div>
                                        )}
                                        {fileObj.status === "error" && (
                                            <div className="absolute inset-0 bg-destructive/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                                                <AlertCircle className="h-6 w-6 text-destructive mb-1" />
                                                <span className="text-[10px] font-bold uppercase">
                                                    Failed
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Overlay for uploading state */}
                                    {(fileObj.status === "uploading" ||
                                        fileObj.status === "thumbnailing") && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-white">
                                            <Loader2 className="h-6 w-6 animate-spin mb-2 text-primary" />
                                            <div className="w-full space-y-1">
                                                <div className="flex justify-between text-[8px] font-bold uppercase">
                                                    <span>
                                                        {fileObj.status ===
                                                        "thumbnailing"
                                                            ? "Processing"
                                                            : "Uploading"}
                                                    </span>
                                                    <span>
                                                        {fileObj.progress}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={fileObj.progress}
                                                    className="h-1 bg-white/20"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* File Info Bar (Compact) */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-1.5 text-[9px] text-white flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="truncate pr-2">
                                            {fileObj.file.name}
                                        </span>
                                        <span className="shrink-0 text-white/70">
                                            {(
                                                fileObj.file.size /
                                                1024 /
                                                1024
                                            ).toFixed(1)}
                                            MB
                                        </span>
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
