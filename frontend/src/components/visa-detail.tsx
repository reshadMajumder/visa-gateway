
'use client';

import { type Visa, type VisaType } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ListChecks, ChevronRight, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createApplicationAction } from "@/app/visas/actions";

interface VisaDetailProps {
  visa: Visa;
  visaType: VisaType;
}

export function VisaDetail({ visa, visaType }: VisaDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleApplyClick = () => {
    if (isLoggedIn) {
      setIsDialogOpen(true);
    } else {
      router.push('/login');
    }
  };

  const handleAddLater = async () => {
    setIsLoading(true);
    const tokens = localStorage.getItem('tokens');
    if (!tokens) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You are not logged in.",
      });
      setIsLoading(false);
      return;
    }

    const { access } = JSON.parse(tokens);

    try {
      const result = await createApplicationAction({
        countryId: visa.id,
        visaTypeId: visaType.id,
        accessToken: access,
      });

      if (result.success) {
        toast({
          title: "Application Created",
          description: "Your application has been successfully created. You can add documents from your dashboard.",
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Application Failed",
          description: result.error || "Could not create application. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };
  
  const handleAddNow = () => {
    setIsDialogOpen(false);
    router.push(`/dashboard/applications/new/${visaType.id}?countryId=${visa.id}&countrySlug=${visa.slug}`);
  };


  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">{visaType.name}</h2>
            {visaType.detailedDescription && (
                <p className="text-muted-foreground">{visaType.detailedDescription}</p>
            )}
            {visaType.expected_processing_time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expected Processing Time: {visaType.expected_processing_time} days</span>
                </div>
            )}
        </div>
        <div className="space-y-6">
          {visaType.info.map((info, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <ListChecks className="h-6 w-6 text-primary"/>
                        <span>{info.title}</span>
                    </CardTitle>
                </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {info.content.map((item: any, i: number) => (
                    <li key={i}>
                      {info.title === 'Required Documents' ? item.document_name : item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Application Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {visaType.price && (
                    <div className="flex items-center justify-center gap-2 text-3xl font-bold font-headline text-primary mb-4">
                        <span>${parseFloat(visaType.price).toFixed(2)}</span>
                    </div>
                )}

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Button className="w-full justify-between" onClick={handleApplyClick} disabled={isLoading}>
                      <span>Apply for {visaType.name}</span>
                      <ChevronRight className="h-4 w-4"/>
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start Your Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        You can upload the required documents now to speed up the process, or you can add them later from your dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleAddLater} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Add Later'}
                      </AlertDialogAction>
                      <Button onClick={handleAddNow}>Add Documents Now</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        Or
                        </span>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm text-center">
                    Our experienced consultants can guide you through the entire application process.
                </p>
                <Button asChild className="w-full" variant="outline">
                    <Link href="/contact">Contact a Consultant</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
