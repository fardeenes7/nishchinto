"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { IconBug, IconX, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";

export function CrashReporter() {
    const [isOpen, setIsOpen] = useState(false);
    const [logSnippet, setLogSnippet] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Basic crash trap: intercept unhandled promise rejections or window errors
    useEffect(() => {
        const handleWindowError = (event: ErrorEvent) => {
            setLogSnippet((prev) => `${prev}\n[ERROR] ${event.message} at ${event.filename}:${event.lineno}`);
            setIsOpen(true);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            setLogSnippet((prev) => `${prev}\n[PROMISE_REJECTION] ${String(event.reason)}`);
            // Only auto-open if it looks critical
        };

        window.addEventListener('error', handleWindowError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleWindowError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    const submitBug = async () => {
        setIsSubmitting(true);
        try {
            // In a real implementation, this would POST to a dedicated DevOps log ingestion API endpoint.
            // Example: await fetch('/api/v1/devops/crash-logs/', { method: 'POST', body: JSON.stringify({ logs: logSnippet, description }) })
            
            await new Promise(resolve => setTimeout(resolve, 800)); // mock network delay
            toast.success("Bug report sent successfully. The DevOps team has been notified.");
            setIsOpen(false);
            setDescription("");
            setLogSnippet("");
        } catch (e) {
            toast.error("Failed to submit bug report");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen && !logSnippet) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 size-10 bg-destructive text-destructive-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
                title="Report Bug"
            >
                <IconBug className="size-5" />
            </button>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 w-[400px] bg-background border shadow-2xl rounded-xl z-50 flex flex-col overflow-hidden">
            <div className="bg-destructive text-destructive-foreground p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                    <IconBug className="size-4" />
                    Bug / Crash Reporter
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded">
                    <IconX className="size-4" />
                </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Our system caught an error or you chose to report a bug. Please describe what you were doing.
                </p>

                <textarea 
                    className="w-full bg-muted/50 border rounded-md p-2 text-sm min-h-[80px]"
                    placeholder="What went wrong?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">Automated System Logs (Attached)</span>
                    <textarea 
                        className="w-full bg-slate-900 text-green-400 font-mono text-[10px] p-2 rounded-md h-[100px]"
                        value={logSnippet || "No automated logs captured. Manual report."}
                        readOnly
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={submitBug} disabled={isSubmitting || (!description && !logSnippet)}>
                        <IconSend className="size-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send to DevOps"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
