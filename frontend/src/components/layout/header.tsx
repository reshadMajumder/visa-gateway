
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, FileText, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string;
}

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (!isClient) {
    return (
        <header className="border-b bg-background">
            <div className="w-full mx-auto">
                 <div className="h-24" />
            </div>
        </header>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  }

  return (
    <header className="border-b bg-background">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Schengen visa gateway logo" width={40} height={40} className="h-10 w-10 text-primary" />
            <div className="font-headline font-bold text-foreground">
                <span className="text-2xl">Schengen</span>
                <span className="text-xl text-muted-foreground"> visa gateway</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            {!isLoggedIn || !user ? (
                <>
                  <Button variant="link" size="sm" asChild>
                    <Link href="/login" className="text-foreground">LOG IN</Link>
                  </Button>
                  <span className="text-muted-foreground">|</span>
                  <Button variant="link" size="sm" asChild>
                    <Link href="/signup" className="text-foreground">SIGN UP</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_picture} alt={`${user.first_name} ${user.last_name}`} />
                        <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="capitalize">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Applications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/account">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
      </div>
    </header>
  );
}
