
'use client';

import { getVisaBySlug, getVisas } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { VisaDetailHero } from "@/components/visa-detail-hero";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function VisaTypesPage() {
  const routeParams = useParams();
  const slug = routeParams?.slug as string;
  const [visa, setVisa] = useState<Awaited<ReturnType<typeof getVisaBySlug>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVisa() {
      try {
        if (!slug) return;
        const visaData = await getVisaBySlug(slug);
        setVisa(visaData);
      } catch (error) {
        console.error("Failed to fetch visa data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVisa();
  }, [slug]);


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!visa) {
    return notFound();
  }

  return (
    <div className="space-y-12 py-8">
      <VisaDetailHero visa={visa} />
      <div className="space-y-6">
        <h2 className="text-3xl font-headline font-bold text-center">Select a Visa Type</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visa.visaTypes.map((visaType) => {
             const isApiImage = visaType.image.startsWith('http');
             const imagePlaceholder = isApiImage ? null : PlaceHolderImages.find(p => p.id === visaType.image);
             const imageUrl = isApiImage ? visaType.image : imagePlaceholder?.imageUrl;
             const imageAlt = isApiImage ? visaType.name : imagePlaceholder?.description || visaType.name;
             const imageHint = isApiImage ? visaType.name.toLowerCase().replace(' ', '') : imagePlaceholder?.imageHint;
            
            return (
              <Link href={`/visas/${visa.slug}/${visaType.id}`} key={visaType.id} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                  {imageUrl && (
                    <div className="relative overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={imageHint}
                      />
                      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black px-3 py-1 text-xs font-semibold">
                        {visa.countryCode}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-xl font-bold text-primary">
                        {visaType.name}
                      </h3>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm h-10">{visaType.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
