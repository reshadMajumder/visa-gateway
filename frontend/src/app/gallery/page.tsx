import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id !== 'hero' && img.id !== 'hero-dublin');

  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Destination Gallery</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get inspired for your next journey.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="group relative overflow-hidden break-inside-avoid">
            <Image
              src={image.imageUrl}
              alt={image.description}
              width={500}
              height={500}
              className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
              <p className="text-white text-center text-sm font-semibold">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
