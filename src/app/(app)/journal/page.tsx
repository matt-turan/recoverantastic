// src/app/journal/page.tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookHeart } from 'lucide-react';

export default function JournalPage() {
  // Mock data for now. In the future, this would come from a database.
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
                What&apos;s on your mind today?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., 'A moment of clarity'" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Today&apos;s Thoughts</Label>
                <Textarea
                  id="content"
                  placeholder="Write about your day, your feelings, or anything that comes to mind."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Entry</Button>
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
