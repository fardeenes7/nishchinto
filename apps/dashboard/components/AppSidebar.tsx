"use client";

import {
  IconBox,
  IconCategory,
  IconDashboard,
  IconSettings,
  IconBrandFacebook,
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
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: IconDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: IconBox,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: IconCategory,
  },
];

const settingsItems = [
  {
    title: "Tracking & Pixels",
    href: "/settings/tracking",
    icon: IconBrandFacebook,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: IconSettings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          {/* Nishchinto logo mark */}
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            ন
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">নিশ্চিন্তে</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Catalog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
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
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="size-8">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">My Shop</span>
            <span className="text-xs text-muted-foreground truncate">
              myshop.nishchinto.com.bd
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
