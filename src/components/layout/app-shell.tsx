'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  BookHeart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/journal',
    label: 'Journal',
    icon: BookHeart,
  },
  {
    href: '/community',
    label: 'Community',
    icon: Users,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-sidebar-border"
      >
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href="#">
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent">
              <Avatar className="size-8">
                <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sidebar-foreground">
                  User
                </span>
                <span className="text-xs text-muted-foreground">
                  user@example.com
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Support">
                  <Link href="#">
                    <LifeBuoy />
                    <span>Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Log Out">
                  <Link href="/">
                    <LogOut />
                    <span>Log Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
