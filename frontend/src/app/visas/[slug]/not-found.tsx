import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold font-headline">Visa Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Sorry, we couldn&apos;t find the visa information for the country you requested.
      </p>
      <Button asChild className="mt-8">
        <Link href="/visas">Back to Visa Directory</Link>
      </Button>
    </div>
  );
}
