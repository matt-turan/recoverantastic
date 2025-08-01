'use client';

import { getAffirmation } from '@/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  affirmation: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Sparkles className="mr-2" />
      )}
      Generate Affirmation
    </Button>
  );
}

export function AffirmationGenerator() {
  const [state, formAction] = useFormState(getAffirmation, initialState);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle>AI Affirmation</CardTitle>
          <CardDescription>
            Generate a personalized affirmation based on your goals and recent
            progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goals">What are your current goals?</Label>
            <Input
              id="goals"
              name="goals"
              placeholder="e.g., 'To stay present and practice gratitude daily.'"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="progressSummary">
              How has your progress been lately?
            </Label>
            <Textarea
              id="progressSummary"
              name="progressSummary"
              placeholder="e.g., 'I managed to handle a stressful situation without resorting to old habits.'"
              required
            />
          </div>
          {state?.affirmation && (
            <div className="rounded-lg border bg-accent/50 p-4">
              <blockquote className="text-lg font-semibold italic text-accent-foreground">
                &quot;{state.affirmation}&quot;
              </blockquote>
            </div>
          )}
          {state?.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
