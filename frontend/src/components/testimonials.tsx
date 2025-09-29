
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { testimonials } from "@/lib/data"
import { Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section>
      <h2 className="text-3xl font-headline font-bold mb-8 text-center">What Our Clients Say</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <Quote className="h-8 w-8 text-primary/50"/>
                    <p className="text-muted-foreground text-sm italic">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold font-headline">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">Visa to {testimonial.country}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
