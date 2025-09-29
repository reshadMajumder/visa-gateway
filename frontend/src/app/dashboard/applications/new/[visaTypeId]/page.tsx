

'use client';

import { useState, useEffect } from 'react';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import { getVisaTypeDetails } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createApplicationWithDocumentsAction } from '@/app/visas/actions';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';

type RequiredDocument = {
    id: string;
    document_name: string;
};

type VisaType = {
    id: string;
    name: string;
    info: any[]; // simplified
    required_documents: RequiredDocument[];
};

type Country = {
    id: string;
    slug: string;
    country: string;
};

export default function NewApplicationPage({ params }: { params: { visaTypeId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const countryId = searchParams.get('countryId');
  const countrySlug = searchParams.get('countrySlug');
  
  const [country, setCountry] = useState<Country | null>(null);
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!countryId || !countrySlug) {
      notFound();
      return;
    }
    
    const fetchDetails = async () => {
      try {
        const { country: fetchedCountry, visaType: fetchedVisaType } = await getVisaTypeDetails(countrySlug, params.visaTypeId);
        if (fetchedCountry && fetchedVisaType) {
          const requiredDocsInfo = fetchedVisaType.info.find(i => i.title === 'Required Documents');
          const transformedVisaType = {
              ...fetchedVisaType,
              required_documents: requiredDocsInfo?.content.map((doc: any) => ({
                  id: doc.id.toString(),
                  document_name: doc.document_name
              })) || []
          };
          
          setCountry(fetchedCountry as any);
          setVisaType(transformedVisaType as any);

        } else {
            notFound();
        }
      } catch (error) {
          console.error("Failed to fetch visa details", error);
          notFound();
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchDetails();
  }, [params.visaTypeId, countryId, countrySlug]);

  const handleFileChange = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [documentId]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const tokens = localStorage.getItem('tokens');
    if (!tokens || !countryId || !visaType) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Authentication details or visa information is missing.',
      });
      setIsLoading(false);
      return;
    }
    
    const { access } = JSON.parse(tokens);

    const formData = new FormData();
    formData.append('country_id', countryId);
    formData.append('visa_type_id', visaType.id);
    
    visaType.required_documents.forEach(doc => {
        if (files[doc.id]) {
            formData.append(`required_documents[${doc.id}]`, files[doc.id] as File);
        }
    });

    const result = await createApplicationWithDocumentsAction({ formData, accessToken: access });

    if (result.success) {
      toast({
        title: 'Application Created',
        description: 'Your application and documents have been submitted.',
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Application Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  };
  
   if (isFetching || !country || !visaType) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }


  return (
    <div className="space-y-6">
        <Button asChild variant="outline">
          <Link href={`/visas/${country.slug}/${visaType.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Visa Details
          </Link>
        </Button>
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>New Application for {visaType.name}</CardTitle>
                <CardDescription>Upload the required documents for your application to {country.country}.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {visaType.required_documents.map(doc => (
                            <div key={doc.id} className="space-y-2">
                                <Label htmlFor={`doc-${doc.id}`}>{doc.document_name}</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id={`doc-${doc.id}`}
                                        type="file"
                                        onChange={(e) => handleFileChange(doc.id, e)}
                                        className="flex-1"
                                    />
                                    {files[doc.id] && (
                                        <span className="text-sm text-muted-foreground truncate max-w-xs">{files[doc.id]?.name}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                        <UploadCloud className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
