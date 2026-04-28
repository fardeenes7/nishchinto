import { GalleryVerticalEnd } from "lucide-react";

import LoginForm from "./form";
import { Suspense } from "react";
import { Spinner } from "@repo/ui/components/ui/spinner";

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden bg-primary text-primary-foreground lg:block">
                <div className="flex h-full flex-col items-start justify-end p-10">
                    <h1 className="z-10 text-5xl font-semibold">
                        Run your business
                        <br /> not spreadsheets.
                    </h1>
                    <p className="z-10 mt-8 text-lg font-medium">
                        Manage orders, track inventory, and get paid — all in
                        one place.
                    </p>
                    <p className="z-10 mt-25 text-sm text-primary-foreground/50">
                        &copy; 2026 Mohajon. All rights reserved.
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-end">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Mohajon
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Suspense
                            fallback={
                                <div className="min-h-screen flex items-center justify-center bg-background">
                                    <Spinner />
                                </div>
                            }
                        >
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
