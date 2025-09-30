'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
    const isMobile = useIsMobile();

    if (!isMobile) return null;
    
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
                <span className="font-headline text-lg font-bold">Feira Livre</span>
            </div>
        </header>
    )
}
