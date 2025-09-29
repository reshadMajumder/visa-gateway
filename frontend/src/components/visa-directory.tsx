
import { type Visa } from '@/lib/data';
import { VisaCard } from './visa-card';

interface VisaDirectoryProps {
  visas: Visa[];
}

export function VisaDirectory({ visas }: VisaDirectoryProps) {

  return (
    <div className="space-y-8">
      {visas.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map(visa => (
            <VisaCard key={visa.id} visa={visa} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No countries found.</p>
        </div>
      )}
    </div>
  );
}
