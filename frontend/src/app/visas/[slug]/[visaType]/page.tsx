import { getVisaTypeDetails, getVisas, getVisaBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { VisaDetailHero } from "@/components/visa-detail-hero";
import { VisaDetail } from "@/components/visa-detail";

export async function generateStaticParams() {
  const visas = await getVisas();
  const allParams: { slug: string; visaType: string }[] = [];

  for (const summaryVisa of visas) {
    // Fetch the detailed visa information which includes the visa types
    const detailedVisa = await getVisaBySlug(summaryVisa.slug);
    if (detailedVisa && detailedVisa.visaTypes) {
      for (const visaType of detailedVisa.visaTypes) {
        allParams.push({ slug: detailedVisa.slug, visaType: visaType.id.toString() });
      }
    }
  }
  
  return allParams;
}

export default async function VisaTypeDetailPage({ params }: { params: Promise<{ slug: string; visaType: string }> }) {
  const { slug, visaType: visaTypeParam } = await params;
  const { country, visaType } = await getVisaTypeDetails(slug, visaTypeParam);

  if (!country || !visaType) {
    notFound();
  }

  return (
    <div className="space-y-12 py-8">
      <VisaDetailHero visa={country} />
      <VisaDetail visa={{...country, info: visaType.info}} visaType={visaType} />
    </div>
  );
}
