

'use client';

import { useState, useEffect } from 'react';
import { getApplicationById, statusVariantMap, Application } from "@/lib/data";
import { notFound, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertCircle, FileText, Info, User, Calendar, RefreshCw, UploadCloud, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { updateApplicationDocumentsAction } from '@/app/visas/actions';
import { Input } from '@/components/ui/input';

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

  const fetchApplication = async () => {
    setIsLoading(true);
    const app = await getApplicationById(id);
    if (app) {
      setApplication(app);
    } else {
      setApplication(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleFileChange = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [documentId]: e.target.files[0] }));
    }
  };

  const handleUpdateDocuments = async () => {
    if (!application || Object.keys(files).length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please select at least one file to update.',
      });
      return;
    }
    
    setIsUpdating(true);
    const tokens = localStorage.getItem('tokens');
    if (!tokens) {
      toast({ variant: 'destructive', title: 'Authentication Error' });
      setIsUpdating(false);
      return;
    }

    const { access } = JSON.parse(tokens);
    
    const formData = new FormData();
    formData.append('country_id', application.countryId);
    formData.append('visa_type_id', application.visaTypeId);
    
    Object.keys(files).forEach(docId => {
      if (files[docId]) {
        formData.append(`required_documents[${docId}]`, files[docId] as File);
      }
    });

    const result = await updateApplicationDocumentsAction({
      applicationId: application.id,
      formData,
      accessToken: access,
    });

    if (result.success) {
      toast({
        title: 'Documents Updated',
        description: 'Your documents have been successfully updated.',
      });
      setFiles({});
      fetchApplication(); // Re-fetch data to show updates
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }

    setIsUpdating(false);
  };


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!application) {
    return notFound();
  }
  
  const overallStatus = application.status.replace(/_/g, ' ');


  return (
    <div className="space-y-6">
       <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Application #{application.id}</CardTitle>
              <CardDescription>
                Details for your visa application to <span className="font-semibold text-primary">{application.country}</span>.
              </CardDescription>
            </div>
             <Badge variant={statusVariantMap[application.status]} className="capitalize text-base">
                {overallStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
                <Info className="h-8 w-8 text-primary"/>
                <div>
                    <p className="text-sm text-muted-foreground">Visa Type</p>
                    <p className="font-semibold">{application.visaType}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-primary"/>
                <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-semibold">{application.username}</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary"/>
                <div>
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="font-semibold">{application.date}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <RefreshCw className="h-8 w-8 text-primary"/>
                <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-semibold">{application.updatedAt}</p>
                </div>
            </div>
        </CardContent>
      </Card>
      
      {(application.adminNotes || application.rejectionReason) && (
        <Card>
          <CardHeader>
            <CardTitle>Administrative Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.rejectionReason && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Rejection Reason</AlertTitle>
                  <AlertDescription>{application.rejectionReason}</AlertDescription>
              </Alert>
            )}
            {application.adminNotes && (
              <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Admin Notes</AlertTitle>
                  <AlertDescription>{application.adminNotes}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary"/>
                  Required Documents
              </CardTitle>
              <Button onClick={handleUpdateDocuments} disabled={isUpdating || Object.keys(files).length === 0}>
                {isUpdating ? 'Updating...' : 'Update Selected Files'}
                <UploadCloud className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Upload or update the required documents for your application.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {application.requiredDocuments.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.document_name}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariantMap[doc.status]} className="capitalize">
                                    {doc.status.replace(/_/g, ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {doc.admin_notes && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{doc.admin_notes}</span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <div className="flex items-center gap-2 max-w-sm ml-auto">
                                    <Input
                                        id={`doc-${doc.id}`}
                                        type="file"
                                        onChange={(e) => handleFileChange(doc.id.toString(), e)}
                                        className="text-xs"
                                    />
                                  </div>
                                  {doc.document_file && (
                                      <Button asChild variant="link" size="sm">
                                          <a href={doc.document_file} target="_blank" rel="noopener noreferrer">View</a>
                                      </Button>
                                  )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
