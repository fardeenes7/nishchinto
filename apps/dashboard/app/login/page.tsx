"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card";
import { IconBrandGoogle, IconShieldLock, IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import { Badge } from "@repo/ui/components/ui/badge";

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";

    const handleGoogleLogin = () => {
        setLoading(true);
        // Use Auth.js to handle the login flow
        signIn("google", { callbackUrl: returnUrl });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-background to-background p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-4 pb-8">
                    <div className="flex justify-center">
                        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <IconShieldLock className="size-8 text-primary-foreground" />
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Seller Dashboard</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Sign in with your Google account to manage your shop
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-center text-muted-foreground leading-relaxed">
                        By signing in, you agree to Nishchinto's Terms of Service and Privacy Policy. All accounts are now open to the public.
                    </div>
                    
                    <Button 
                        onClick={handleGoogleLogin}
                        className="w-full h-14 text-lg font-semibold gap-3 shadow-lg shadow-primary/10 bg-white hover:bg-white/90 text-black border-border/40"
                        disabled={loading}
                    >
                        {loading ? (
                            <IconLoader2 className="size-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <IconBrandGoogle className="size-6" />
                                Sign in with Google
                            </>
                        )}
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t pt-6">
                    <div className="flex justify-center gap-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest opacity-50 px-2">
                            Secure OAuth 2.0
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest opacity-50 px-2">
                            Public Access Live
                        </Badge>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-tighter">
                        Powered by Nishchinto Cloud Security
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <IconLoader2 className="size-8 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
