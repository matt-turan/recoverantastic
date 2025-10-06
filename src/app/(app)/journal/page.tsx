// src/app/journal/page.tsx
'use client';

import { generateJournalPrompt } from '@/ai/flows/generate-journal-prompt';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BookHeart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const moods = ['Anxious', 'Grateful', 'Overwhelmed', 'Hopeful', 'Numb', 'Sad'];

export default function JournalPage() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entryContent, setEntryContent] = useState('');

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setIsLoading(true);
    setGeneratedPrompt(null);
    try {
      const { prompt } = await generateJournalPrompt({ mood });
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'There was an issue generating your journal prompt. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setGeneratedPrompt(null);
    setEntryContent('');
  };

  // Mock data for now.
  const journalEntries = [
    {
      id: 1,
      title: 'A Good Day',
      date: 'July 26, 2024',
      excerpt: 'Today was a good day. I felt strong and managed to...',
    },
    {
      id: 2,
      title: 'A Small Victory',
      date: 'July 25, 2024',
      excerpt: 'I practiced deep breathing when I felt overwhelmed...',
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          My Journal
        </h2>
        <p className="text-muted-foreground">
          A private space for your thoughts and reflections.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Entry</CardTitle>
              <CardDescription>
                {!selectedMood
                  ? "How are you feeling right now?"
                  : "Here's a prompt to get you started."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[280px]">
              {!selectedMood ? (
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood}
                      variant="outline"
                      onClick={() => handleMoodSelect(mood)}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin" />
                  <span>Generating your prompt...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Prompt</Label>
                    <p className="font-semibold text-lg p-4 bg-muted/50 rounded-md">
                      {generatedPrompt}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Thoughts</Label>
                    <Textarea
                      id="content"
                      value={entryContent}
                      onChange={(e) => setEntryContent(e.target.value)}
                      placeholder="Write about your day, your feelings, or anything that comes to mind."
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button disabled={!generatedPrompt}>Save Entry</Button>
              {(generatedPrompt || isLoading) && (
                 <Button variant="ghost" onClick={handleReset} disabled={isLoading}>Start Over</Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Past Entries</h3>
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription>{entry.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{entry.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {journalEntries.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
                  <BookHeart className="mx-auto size-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start by writing your first journal entry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
