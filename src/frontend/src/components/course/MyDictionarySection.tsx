import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Trash2, AlertCircle } from 'lucide-react';
import { useGetWordBank, useRemoveWord } from '@/hooks/useWordBank';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';

export function MyDictionarySection() {
  const { identity } = useInternetIdentity();
  const { data: wordBank = [], isLoading, error } = useGetWordBank();
  const removeWordMutation = useRemoveWord();

  const handleRemoveWord = async (word: string) => {
    try {
      await removeWordMutation.mutateAsync(word);
      toast.success(`"${word}" removed from Word Bank`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove word');
    }
  };

  if (!identity) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Dictionary
          </CardTitle>
          <CardDescription>Your saved words and meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Login to access your personal Word Bank
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Dictionary
          </CardTitle>
          <CardDescription>Your saved words and meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Dictionary
          </CardTitle>
          <CardDescription>Your saved words and meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load Word Bank. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (wordBank.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Dictionary
          </CardTitle>
          <CardDescription>Your saved words and meanings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No words saved yet. Select any word from the lesson content and click "Save to Word Bank" to start building your dictionary!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          My Dictionary
        </CardTitle>
        <CardDescription>
          {wordBank.length} {wordBank.length === 1 ? 'word' : 'words'} saved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {wordBank.map((entry, idx) => (
              <Card key={idx} className="p-4 bg-accent/5">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-foreground mb-1">
                      {entry.word}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {entry.meaning}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveWord(entry.word)}
                    disabled={removeWordMutation.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
