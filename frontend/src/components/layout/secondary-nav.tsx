'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { getVisas } from '@/lib/data';
import React, { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/visas', label: 'Countries', isDropdown: true },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
];

export function SecondaryNav() {
  const pathname = usePathname();
  const [visas, setVisas] = useState<Awaited<ReturnType<typeof getVisas>>>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    getVisas().then(setVisas);
  }, []);

  if (!isClient) {
    return (
      <nav className="w-full border-b bg-card">
          <div className="flex items-center h-14 w-full mx-auto" />
      </nav>
    );
  }

  return (
    <nav className="w-full border-b bg-card">
      <div className="flex items-center h-14 w-full mx-auto">
        <div className="flex items-center justify-between w-full">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

            if (link.isDropdown) {
              return (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 text-sm font-bold tracking-wide transition-colors hover:text-primary focus:outline-none',
                        isActive ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {link.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {visas.map((visa) => (
                      <DropdownMenuItem key={visa.slug} asChild>
                        <Link href={`/visas/${visa.slug}`}>
                          {visa.flag} {visa.country}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-bold tracking-wide transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
