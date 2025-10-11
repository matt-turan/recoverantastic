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
import { useState, useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  saveJournalEntry,
  getJournalEntries,
  type JournalEntry,
} from '@/lib/actions';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const moods = ['Anxious', 'Grateful', 'Overwhelmed', 'Hopeful', 'Numb', 'Sad'];

export default function JournalPage() {
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isSaving, startSavingTransition] = useTransition();
  const [isLoadingEntries, startLoadingEntriesTransition] = useTransition();
  const [entryContent, setEntryContent] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      startLoadingEntriesTransition(async () => {
        try {
          const entries = await getJournalEntries();
          setJournalEntries(entries);
        } catch (error) {
          console.error('Error fetching journal entries:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load past journal entries.',
          });
        }
      });
    }
  }, [user, toast]);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setIsLoadingPrompt(true);
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
      setIsLoadingPrompt(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!generatedPrompt || !entryContent || !user) return;

    startSavingTransition(async () => {
      try {
        const newEntry: Omit<JournalEntry, 'id' | 'date'> = {
          prompt: generatedPrompt,
          content: entryContent,
          mood: selectedMood || 'General',
          userId: user.uid,
        };
        const savedEntry = await saveJournalEntry(newEntry);
        setJournalEntries([savedEntry, ...journalEntries]);
        handleReset();
        toast({
          title: 'Entry Saved',
          description: 'Your journal entry has been saved successfully.',
        });
      } catch (error) {
        console.error('Error saving entry:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Your entry could not be saved. Please try again.',
        });
      }
    });
  };

  const handleReset = () => {
    setSelectedMood(null);
    setGeneratedPrompt(null);
    setEntryContent('');
  };
  
  if (userLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

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
                  ? 'How are you feeling right now?'
                  : "Here's a prompt to get you started."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[350px]">
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
              ) : isLoadingPrompt ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground h-full">
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
              <Button
                onClick={handleSaveEntry}
                disabled={!entryContent || isSaving}
              >
                {isSaving && <Loader2 className="mr-2 animate-spin" />}
                Save Entry
              </Button>
              {(generatedPrompt || isLoadingPrompt) && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  disabled={isLoadingPrompt || isSaving}
                >
                  Start Over
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Past Entries</h3>
            <div className="space-y-4">
              {isLoadingEntries ? (
                <div className="flex items-center justify-center pt-12">
                  <Loader2 className="animate-spin text-muted-foreground" />
                </div>
              ) : journalEntries.length > 0 ? (
                journalEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle>{entry.prompt}</CardTitle>
                      <CardDescription>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{entry.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" disabled>
                        Read More
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
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
