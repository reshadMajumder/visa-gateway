import { getVisas } from "@/lib/data";
import { VisaDirectory } from "@/components/visa-directory";

export default async function VisasPage() {
  const visas = await getVisas();
  
  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Visa Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find visa information for your next destination.</p>
      </div>
      <VisaDirectory visas={visas} />
    </div>
  );
}
