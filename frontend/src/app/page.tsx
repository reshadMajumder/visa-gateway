import { VisaDirectory } from "@/components/visa-directory";
import { Hero } from "@/components/hero";
import { getVisas } from "@/lib/data";
import { Testimonials } from "@/components/testimonials";
import { WhyChooseUs } from "@/components/why-choose-us";

export default async function Home() {
  const visas = await getVisas();
  
  return (
    <div className="space-y-12 py-8">
      <Hero />
      <section>
        <h2 className="text-3xl font-headline font-bold mb-6 text-center">Your Destinations</h2>
        <VisaDirectory visas={visas} />
      </section>
      <Testimonials />
      <WhyChooseUs />
    </div>
  );
}
