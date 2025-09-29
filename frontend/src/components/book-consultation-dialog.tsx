
'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { bookConsultationAction } from '@/app/contact/actions';

interface BookConsultationDialogProps {
  countries: string[];
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Request'
      )}
    </Button>
  );
}

export function BookConsultationDialog({
  countries,
  children,
  open,
  onOpenChange,
}: BookConsultationDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(bookConsultationAction, null);

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: 'Consultation Booked!',
        description: state.message,
      });
      onOpenChange(false);
    } else if (state?.success === false && state.message) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: state.message,
      });
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Consultation</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule a consultation with one of our
            visa experts.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="scheduled_at" className="text-right">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] justify-start text-left font-normal col-span-3',
                      !'' && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <input type="hidden" name="scheduled_at" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                    {format(new Date(), 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    onSelect={(date) => {
                      const input = document.querySelector<HTMLInputElement>('input[name="scheduled_at"]');
                      if (input && date) {
                        input.value = format(date, 'yyyy-MM-dd');
                        // a bit of a hack to update the button text
                        const button = input.parentElement as HTMLButtonElement;
                        button.childNodes[1].textContent = format(date, 'PPP');
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email_or_phone" className="text-right">
                Email/Phone
              </label>
              <Input
                id="email_or_phone"
                name="email_or_phone"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="preferred_country" className="text-right">
                Country
              </label>
              <Select name="preferred_country">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a country" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Tell us about your travel plans or specific questions."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
