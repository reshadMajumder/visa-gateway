
'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Visa Directory", href: "/visas" },
        { label: "Smart Itinerary", href: "/smart-itinerary" },
        { label: "Consultation", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Schengen visa gateway logo" width={32} height={32} className="h-8 w-8 text-primary" />
              <div className="font-headline font-bold text-foreground">
                <span className="text-xl">Schengen</span>
                <span className="text-lg text-muted-foreground"> visa gateway</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Simplifying global travel with expert visa guidance and a powerful itinerary planner.
            </p>
            <form className="flex w-full max-w-sm">
                <Input type="email" placeholder="Enter your email" className="rounded-r-none" />
                <Button type="submit" className="rounded-l-none">Subscribe</Button>
            </form>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold font-headline text-foreground tracking-wider uppercase mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Schengen visa gateway. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {social.icon}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
