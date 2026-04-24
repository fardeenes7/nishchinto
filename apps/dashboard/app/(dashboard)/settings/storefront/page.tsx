import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Switch } from "@repo/ui/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";

export default function StorefrontSettingsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Storefront Toggles</h1>
                    <p className="text-muted-foreground mt-1">
                        Control the visibility of features on your public storefront.
                    </p>
                </div>
                <Button>
                    <IconDeviceFloppy className="size-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Display Preferences</CardTitle>
                        <CardDescription>
                            Configure what your customers can see on the product pages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">Show Stock Count</span>
                                <span className="text-sm text-muted-foreground">
                                    Display the exact remaining inventory quantity to customers.
                                </span>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">Enable Product Reviews</span>
                                <span className="text-sm text-muted-foreground">
                                    Allow customers to leave reviews on your products.
                                </span>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">Maintenance Mode</span>
                                <span className="text-sm text-muted-foreground">
                                    Temporarily disable the storefront and show a maintenance page.
                                </span>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax & Discount Rules</CardTitle>
                        <CardDescription>
                            Configure how prices, taxes, and discounts are calculated at checkout.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Tax Calculation Base</label>
                            <Select defaultValue="DISCOUNTED">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select calculation base" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ORIGINAL">Calculate Tax on Original Price</SelectItem>
                                    <SelectItem value="DISCOUNTED">Calculate Tax on Discounted Price</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Determines whether tax is applied before or after discounts.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Discount Application</label>
                            <Select defaultValue="EXCLUSIVE">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select discount application" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EXCLUSIVE">Discount is Exclusive of Tax</SelectItem>
                                    <SelectItem value="INCLUSIVE">Discount is Inclusive of Tax</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Determines if the discount value reduces the tax amount (Inclusive) or not (Exclusive).
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
