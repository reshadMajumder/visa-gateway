
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { getSiteSettings, getCountryNames, SiteSettings } from "@/lib/data";
import { BookConsultationDialog } from "@/components/book-consultation-dialog";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
      const countryNames = await getCountryNames();
      setCountries(countryNames);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Contact Us</h1>
        <p className="mt-2 text-lg text-muted-foreground">We&apos;re here to help with all your visa needs.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-headline font-semibold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions about a specific visa or need personalized guidance? Reach out to our team of experts.
            </p>
            <div className="space-y-4">
              {settings?.phone_number && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 mt-1">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a href={`tel:${settings.phone_number}`} className="text-muted-foreground hover:text-primary transition-colors">{settings.phone_number}</a>
                    {settings.phone_number2 && (
                      <a href={`tel:${settings.phone_number2}`} className="block text-muted-foreground hover:text-primary transition-colors">{settings.phone_number2}</a>
                    )}
                  </div>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 mt-1">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition-colors">{settings.email}</a>
                     {settings.email2 && (
                      <a href={`mailto:${settings.email2}`} className="block text-muted-foreground hover:text-primary transition-colors">{settings.email2}</a>
                    )}
                  </div>
                </div>
              )}
               {settings?.address && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 mt-1">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Office</h3>
                    <p className="text-muted-foreground">{settings.address}</p>
                  </div>
                </div>
               )}
            </div>
          </CardContent>
          <div className="p-8 bg-secondary/50">
            <h2 className="text-2xl font-headline font-semibold mb-4">Book a Consultation</h2>
            <p className="text-muted-foreground mb-6">
              Ready to take the next step? Schedule a one-on-one consultation with a visa specialist to discuss your travel plans in detail.
            </p>
            <BookConsultationDialog
              countries={countries}
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              <Button size="lg" className="w-full">
                Schedule Now
              </Button>
            </BookConsultationDialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
