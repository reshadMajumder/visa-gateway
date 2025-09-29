import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { type Visa } from "@/lib/data";

interface VisaDetailHeroProps {
    visa: Visa;
}

export function VisaDetailHero({ visa }: VisaDetailHeroProps) {
  const isApiImage = visa.image.startsWith('http');
  const imagePlaceholder = isApiImage ? null : PlaceHolderImages.find(p => p.id === visa.image);
  const imageUrl = isApiImage ? visa.image : imagePlaceholder?.imageUrl;
  const imageAlt = isApiImage ? visa.country : imagePlaceholder?.description || visa.country;
  const imageHint = isApiImage ? visa.country.toLowerCase() : imagePlaceholder?.imageHint;
  
  return (
    <section className="relative h-[300px] rounded-lg overflow-hidden flex items-center justify-center text-center p-8 text-white">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          data-ai-hint={imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl font-headline font-bold drop-shadow-md">
          {visa.flag} {visa.country}
        </h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto drop-shadow-sm">
          {visa.tagline}
        </p>
      </div>
    </section>
  );
}
