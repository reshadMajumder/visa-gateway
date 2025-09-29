
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ChevronLeft, Building, Plus } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

function AdminSidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    toast({
        title: "Admin Logout Successful"
    });
    router.push('/scp-admin/login');
  };
  
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r">
        <SidebarHeader>
           <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Schengen visa gateway logo" width={32} height={32} className="size-8 text-primary" />
            <div className="flex flex-col">
                 <h2 className="text-lg font-bold font-headline text-primary">Schengen</h2>
                 <p className="text-xs text-muted-foreground -mt-1">visa gateway</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/scp-admin/dashboard'}>
                <Link href="/scp-admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/scp-admin/applications')}>
                <Link href="#">
                  <FileText />
                  <span>Applications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/scp-admin/users')}>
                <Link href="#">
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton isActive={pathname.startsWith('/scp-admin/countries') || pathname.startsWith('/scp-admin/visa-types')}>
                        <Building />
                        <span>Manage</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href="/scp-admin/countries/new">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add Country</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="#">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add Visa Type</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/scp-admin/settings')}>
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
          <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-sm font-medium">Super Admin</p>
                  <p className="text-xs text-muted-foreground">admin@scp.com</p>
              </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full">
         <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold md:text-xl capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}

function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === '/scp-admin/login') {
        return <div className="min-h-screen w-full bg-secondary/30">{children}</div>;
    }

    return (
        <div className="min-h-screen w-full flex">
            <AdminSidebar>{children}</AdminSidebar>
        </div>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsLoggedIn(adminLoggedIn);

    if (!adminLoggedIn && pathname !== '/scp-admin/login') {
      router.push('/scp-admin/login');
    }
  }, [router, pathname]);

  if (!isClient) {
    return null; // or a loading spinner
  }
  
  if (pathname === '/scp-admin/login') {
    return <div className="min-h-screen w-full bg-secondary/30">{children}</div>;
  }
  
  if (!isLoggedIn) {
     return null;
  }

  return (
    <html>
      <body>
          <AdminRootLayout>{children}</AdminRootLayout>
      </body>
    </html>
  );
}
