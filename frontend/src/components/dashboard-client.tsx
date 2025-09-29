
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye } from 'lucide-react';
import { statusVariantMap, Application, getUserApplications } from '@/lib/data';
import Link from 'next/link';

export function DashboardClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        const { access } = JSON.parse(tokens);
        try {
          const userApps = await getUserApplications(access);
          setApplications(userApps);
        } catch (error) {
          console.error("Failed to fetch applications:", error);
        }
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold font-headline">My Applications</h1>
            <p className="text-muted-foreground">
                Track and manage your visa applications.
            </p>
        </div>
        <Button asChild>
            <Link href="/visas">
              <PlusCircle className="mr-2 h-4 w-4"/>
              New Application
            </Link>
        </Button>
      </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Visa Type</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            Loading applications...
                        </TableCell>
                    </TableRow>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{`APP-${app.id}`}</TableCell>
                      <TableCell>{app.country}</TableCell>
                      <TableCell>{app.visaType}</TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[app.status] || 'outline'}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/dashboard/applications/${app.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                            </Link>
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            No applications found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
