import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { IconGlobe, IconCheck, IconAlertCircle } from "@tabler/icons-react";

export default function DomainSettingsPage() {
    // In reality this would fetch from the server
    const currentDomain = "";
    const isVerified = false;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Custom Domain
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Connect a custom domain to your store to build your
                        brand.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Connect Existing Domain</CardTitle>
                    <CardDescription>
                        Enter the domain you want to connect to your store.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="flex items-end gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-sm font-medium">
                                Domain Name
                            </label>
                            <Input placeholder="e.g. www.mystore.com" />
                        </div>
                        <Button>Connect</Button>
                    </div>

                    <div className="bg-muted p-4 rounded-lg flex flex-col gap-4 text-sm">
                        <h4 className="font-semibold flex items-center gap-2">
                            <IconGlobe className="size-4" />
                            How to connect your domain
                        </h4>
                        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                            <li>
                                Log in to your domain provider (e.g. Namecheap,
                                GoDaddy, Cloudflare).
                            </li>
                            <li>Navigate to the DNS management settings.</li>
                            <li>
                                Create a <strong>CNAME</strong> record pointing
                                to{" "}
                                <code className="bg-background px-1 border rounded text-foreground">
                                    shops.mohajon.store
                                </code>
                            </li>
                            <li>
                                Create an <strong>A</strong> record pointing to{" "}
                                <code className="bg-background px-1 border rounded text-foreground">
                                    104.21.XX.XX
                                </code>{" "}
                                (If using a root domain like mystore.com).
                            </li>
                        </ol>
                        <div className="flex items-start gap-2 mt-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded border border-amber-200 dark:border-amber-900">
                            <IconAlertCircle className="size-5 shrink-0" />
                            <p>
                                <strong>Using Cloudflare?</strong> Ensure the
                                proxy status (Orange Cloud) is turned OFF (DNS
                                Only) during the initial connection so we can
                                verify your domain and issue an SSL certificate.
                                You can turn it back on after verification.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SSL Status</CardTitle>
                    <CardDescription>
                        We automatically provision a free Let's Encrypt SSL
                        certificate for your connected domains.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-background">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <IconGlobe className="size-5 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="font-medium">
                                No domain connected
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Connect a domain to see SSL status
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
