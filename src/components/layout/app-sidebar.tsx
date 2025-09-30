'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  BarChart3,
  Lightbulb,
  LogOut,
  Leaf,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/inventory', label: 'Estoque', icon: Boxes },
  { href: '/dashboard/sales', label: 'Vendas', icon: ShoppingCart },
  { href: '/dashboard/purchases', label: 'Compras', icon: Truck },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/recommendations', label: 'Recomendações', icon: Lightbulb },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className={cn("font-headline text-lg font-bold", state === 'collapsed' ? "hidden" : "")}>Feira Livre</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <>
                    <item.icon />
                    <span>{item.label}</span>
                  </>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <div className={cn("flex items-center gap-3 p-2 transition-all", state === 'collapsed' ? 'justify-center' : '')}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", state === 'collapsed' ? "hidden": "")}>
              <span className="text-sm font-semibold">Proprietário</span>
              <span className="text-xs text-muted-foreground">
                admin@feira.com
              </span>
            </div>
            <Button variant="ghost" size="icon" className={cn("ml-auto h-8 w-8", state === 'collapsed' ? "hidden": "")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        <SidebarTrigger>
            <Button variant="ghost" className="w-full justify-start">
                <span className="flex items-center">
                    <ChevronLeft className="mr-2 transition-transform duration-200 group-data-[state=expanded]:rotate-180"/>
                    <span>Recolher</span>
                </span>
            </Button>
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}

export * from '@/components/ui/sidebar';
