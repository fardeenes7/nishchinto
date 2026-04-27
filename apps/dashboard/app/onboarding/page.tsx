import { Suspense } from "react";
import { OnboardingForm } from "./_components/OnboardingForm";

export const metadata = {
    title: "Create Your Shop — Nishchinto",
    description: "Launch your store on Nishchinto in minutes."
};

export default function OnboardingPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
            <div className="max-w-md w-full bg-background border rounded-lg shadow-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">
                        Welcome to Nishchinto
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        Let's set up your store to get you started.
                    </p>
                </div>
                <Suspense
                    fallback={
                        <div className="text-center text-muted-foreground text-sm">
                            Preparing onboarding...
                        </div>
                    }
                >
                    <OnboardingForm />
                </Suspense>
            </div>
        </main>
    );
}
