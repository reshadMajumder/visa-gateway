import { getCountryNames } from "@/lib/data";
import { SmartItineraryForm } from "@/components/smart-itinerary-form";

export default async function SmartItineraryPage() {
  const countries = await getCountryNames();

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">AI-Powered Itinerary Planner</h1>
        <p className="mt-2 text-lg text-muted-foreground">Let our smart assistant help you figure out your visa needs.</p>
      </div>
      <SmartItineraryForm countries={countries} />
    </div>
  );
}
