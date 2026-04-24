"use client";

import {
    IconBox,
    IconCategory,
    IconDashboard,
    IconSettings,
    IconBrandFacebook,
    IconPlugConnected,
    IconMessage,
    IconMessageQuestion,
    IconBuildingStore,
    IconGlobe,
    IconStar,
    IconCreditCard
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@repo/ui/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

const navItems = [
    {
        title: "Overview",
        href: "/",
        icon: IconDashboard
    },
    {
        title: "Inbox",
        href: "/inbox",
        icon: IconMessage
    },
    {
        title: "Products",
        href: "/products",
        icon: IconBox
    },
    {
        title: "Store Builder",
        href: "/builder",
        icon: IconBuildingStore
    },
    {
        title: "Categories",
        href: "/categories",
        icon: IconCategory
    }
];

const settingsItems = [
    {
        title: "Social Connections",
        href: "/settings/social",
        icon: IconPlugConnected
    },
    {
        title: "Tracking & Pixels",
        href: "/settings/tracking",
        icon: IconBrandFacebook
    },
    {
        title: "FAQ & Policies",
        href: "/settings/faq",
        icon: IconMessageQuestion
    },
    {
        title: "Storefront",
        href: "/settings/storefront",
        icon: IconBuildingStore
    },
    {
        title: "Custom Domain",
        href: "/settings/domain",
        icon: IconGlobe
    },
    {
        title: "Billing & Plans",
        href: "/settings/billing",
        icon: IconStar
    },
    {
        title: "Payments",
        href: "/settings/payments",
        icon: IconCreditCard
    },
    {
        title: "Developer API",
        href: "/settings/api",
        icon: IconPlugConnected
    },
    {
        title: "Settings",
        href: "/settings",
        icon: IconSettings
    }
];

const accountingItems = [
    {
        title: "Platform Balance",
        href: "/accounting/balance",
        icon: IconCreditCard
    },
    {
        title: "Purchase Orders",
        href: "/accounting/purchase-orders",
        icon: IconBox
    }
];

import { DashboardShopContext } from "@/lib/shop-context";

export function AppSidebar({ context }: { context: DashboardShopContext }) {
    const pathname = usePathname();
    const { subscription } = context;
    const { limits } = subscription;

    const filteredNavItems = navItems.filter(item => {
        // POS System check
        if (item.href === "/pos" && !limits.pos_system) return false;
        return true;
    });

    const filteredSettingsItems = settingsItems.filter(item => {
        // Developer API check
        if (item.href === "/settings/api" && !limits.developer_api) return false;
        // Tracking check
        if (item.href === "/settings/tracking" && !limits.marketing_pixels) return false;
        return true;
    });

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    {/* Nishchinto logo mark */}
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                        ন
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            নিশ্চিন্তে
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {subscription.tier} Plan
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Catalog</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            item.href === "/"
                                                ? pathname === "/"
                                                : pathname.startsWith(item.href)
                                        }
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Accounting</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountingItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(item.href)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredSettingsItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname.startsWith(
                                            item.href
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center gap-2 px-2 py-2">
                    <Avatar className="size-8">
                        <AvatarFallback>{context.shopName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                            {context.shopName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                            {context.role}
                        </span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
