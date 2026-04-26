"use client";

import { useState, useEffect } from "react";
import { IconTarget, IconLoader2, IconCircleCheck, IconSpeakerphone } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";

export default function AdsPage() {
  const [shopId, setShopId] = useState("");
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [campaignName, setCampaignName] = useState("Traffic Boost - " + new Date().toLocaleDateString());
  const [budget, setBudget] = useState("500");
  const [gender, setGender] = useState("ALL");

  useEffect(() => {
    // Hack to get shopId from path
    const sid = window.location.pathname.split("/")[1];
    setShopId(sid);
    fetchAdAccounts(sid);
  }, []);

  const fetchAdAccounts = async (sid: string) => {
    try {
      const res = await fetch(`/api/proxy/marketing/ads/available-accounts/`, {
        headers: { "X-Tenant-ID": sid }
      });
      const data = await res.json();
      if (res.ok) {
        setAdAccounts(data);
      } else {
        toast.error(data.detail || "Failed to load ad accounts. Make sure Meta is connected.");
      }
    } catch (error) {
      toast.error("Network error fetching ad accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!selectedAccountId) {
      toast.error("Please select an ad account.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch(`/api/proxy/marketing/ads/create-campaign/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": shopId,
        },
        body: JSON.stringify({
          ad_account_id: selectedAccountId,
          name: campaignName,
          daily_budget_bdt: budget,
          gender: gender,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Campaign created successfully! It is currently PAUSED in Meta Ads Manager.");
      } else {
        toast.error(data.detail || "Failed to create campaign.");
      }
    } catch (error) {
      toast.error("Network error creating campaign.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <IconLoader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meta Ad Automation</h1>
          <p className="text-sm text-muted-foreground">Launch high-performance traffic campaigns directly from your dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTarget className="size-5 text-primary" />
                Campaign Wizard
              </CardTitle>
              <CardDescription>Configure your simplified Meta Traffic campaign.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ad-account">Ad Account</Label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger id="ad-account">
                      <SelectValue placeholder="Select an ad account" />
                    </SelectTrigger>
                    <SelectContent>
                      {adAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({acc.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input 
                    id="campaign-name" 
                    value={campaignName} 
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="budget">Daily Budget (BDT)</Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="gender">Target Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Genders</SelectItem>
                        <SelectItem value="MALE">Men Only</SelectItem>
                        <SelectItem value="FEMALE">Women Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 text-sm font-medium">Smart Defaults Applied:</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  <li>Location: Bangladesh (Country-wide)</li>
                  <li>Platforms: Facebook & Instagram News Feeds</li>
                  <li>Optimization: Link Clicks</li>
                  <li>Schedule: Continuous starting today</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleLaunch} 
                disabled={isCreating || adAccounts.length === 0}
                className="w-full gap-2"
              >
                {isCreating ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Deploying to Meta...
                  </>
                ) : (
                  <>
                    <IconSpeakerphone className="size-4" />
                    Launch Automated Campaign
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Ad Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Campaigns</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Cost Per Click</span>
                  <span className="font-medium text-sm">--</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Automated campaigns use Meta's Advantage+ targeting to find your best customers automatically. 
                Ensure your product images are high quality for better conversion.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
