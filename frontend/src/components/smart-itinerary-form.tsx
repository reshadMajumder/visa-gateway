'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getSmartItinerarySuggestionsAction } from '@/app/smart-itinerary/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

interface SmartItineraryFormProps {
  countries: string[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Getting Suggestions...' : 'Get Smart Suggestions'}
    </Button>
  );
}

export function SmartItineraryForm({ countries }: SmartItineraryFormProps) {
  const [state, formAction] = useFormState(getSmartItinerarySuggestionsAction, null);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Smart Itinerary Suggestions</CardTitle>
        <CardDescription>
          Select your origin and destination countries, and our AI will suggest relevant visa options for your trip.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="originCountry" className="font-medium">From</label>
              <Select name="originCountry" required>
                <SelectTrigger id="originCountry">
                  <SelectValue placeholder="Select origin country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="destinationCountry" className="font-medium">To</label>
              <Select name="destinationCountry" required>
                <SelectTrigger id="destinationCountry">
                  <SelectValue placeholder="Select destination country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <SubmitButton />
        </form>

        {state?.error && (
          <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        
        {state?.suggestions && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-headline text-xl font-semibold mb-4">Visa Suggestions</h3>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {state.suggestions.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
