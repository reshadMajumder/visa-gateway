import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === "hero");

  return (
    <section className="relative h-[400px] flex items-center justify-center text-center p-8 text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl font-headline font-bold drop-shadow-md">
          Your Partner in Global Travel
        </h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto drop-shadow-sm">
          A professional visa consultancy platform to help users explore global visa requirements with ease and confidence.
        </p>
        <Button asChild size="lg" variant="outline" className="mt-8 bg-transparent border-white text-white hover:bg-white hover:text-black">
          <Link href="/visas">
            Explore Visas <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
