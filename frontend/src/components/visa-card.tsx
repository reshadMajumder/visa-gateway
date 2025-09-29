import Link from "next/link";
import Image from "next/image";
import { type Visa } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Star, User } from "lucide-react";
import { Badge } from "./ui/badge";

interface VisaCardProps {
  visa: Visa;
}

export function VisaCard({ visa }: VisaCardProps) {
  const isApiImage = visa.image.startsWith('http');
  const imagePlaceholder = isApiImage ? null : PlaceHolderImages.find(p => p.id === visa.image);
  const imageUrl = isApiImage ? visa.image : imagePlaceholder?.imageUrl;
  const imageAlt = isApiImage ? visa.country : imagePlaceholder?.description || visa.country;
  const imageHint = isApiImage ? visa.country.toLowerCase() : imagePlaceholder?.imageHint;

  return (
    <Link href={`/visas/${visa.slug}`} className="group block">
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
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-black p-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        )}
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-primary">
              {visa.country}
            </h3>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>

          <p className="text-foreground text-sm">{visa.subTagline}</p>
          

          <div className="flex items-center gap-2 text-sm text-foreground pt-2">
            <User className="h-4 w-4" />
            <span>{visa.appliedCount}+ applied</span>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}
