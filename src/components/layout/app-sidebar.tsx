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
  Leaf,
  ChevronLeft,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { auth } from '@/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['administrador', 'funcionario'] },
  { href: '/dashboard/inventory', label: 'Estoque', icon: Boxes, roles: ['administrador', 'funcionario'] },
  { href: '/dashboard/sales', label: 'Vendas', icon: ShoppingCart, roles: ['administrador', 'funcionario'] },
  { href: '/dashboard/purchases', label: 'Compras', icon: Truck, roles: ['administrador', 'funcionario'] },
  { href: '/dashboard/employees', label: 'Funcionários', icon: Users, roles: ['administrador'] },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3, roles: ['administrador'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, profile, loading } = useUser();
  const router = useRouter();


  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  }

  const filteredMenuItems = menuItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className={cn("font-headline text-lg font-bold", state === 'collapsed' ? "hidden" : "")}>Excelência Frutas</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {loading && !profile ? (
            <div className="flex flex-col gap-2">
              <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ) : filteredMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="w-full"
                >
                    <p>
                      <item.icon />
                      <span>{item.label}</span>
                    </p>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <div className={cn("flex items-center gap-3 p-2 transition-all", state === 'collapsed' ? 'justify-center' : '')}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/40/40`} alt="User" />
              <AvatarFallback>{profile?.name?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", state === 'collapsed' ? "hidden": "")}>
              <span className="text-sm font-semibold">{profile?.name || 'Usuário'}</span>
              <span className="text-xs text-muted-foreground">
                {profile?.email}
              </span>
            </div>
          </div>
        <SidebarTrigger>
          <Button variant="ghost" className="w-full justify-center">
              <span className="flex items-center justify-center">
                  <ChevronLeft className="mr-2 transition-transform duration-200 group-data-[state=expanded]:rotate-180"/>
                  <span className={cn(state === 'collapsed' ? 'hidden' : '')}>Recolher</span>
              </span>
          </Button>
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}

export * from '@/components/ui/sidebar';
