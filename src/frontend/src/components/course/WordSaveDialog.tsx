import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useSaveWord } from '@/hooks/useWordBank';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';

interface WordSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWord?: string;
  initialMeaning?: string;
}

export function WordSaveDialog({ open, onOpenChange, initialWord = '', initialMeaning = '' }: WordSaveDialogProps) {
  const { identity } = useInternetIdentity();
  const [word, setWord] = useState(initialWord);
  const [meaning, setMeaning] = useState(initialMeaning);
  const saveWordMutation = useSaveWord();

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please log in to save words to your Word Bank');
      return;
    }

    if (!word.trim()) {
      toast.error('Please enter a word');
      return;
    }

    if (!meaning.trim()) {
      toast.error('Please enter a meaning');
      return;
    }

    try {
      await saveWordMutation.mutateAsync({ word: word.trim(), meaning: meaning.trim() });
      toast.success(`"${word}" saved to your Word Bank!`);
      onOpenChange(false);
      setWord('');
      setMeaning('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save word');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Word Bank</DialogTitle>
          <DialogDescription>
            Add this word to your personal dictionary for future reference
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter the word"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meaning">Meaning</Label>
            <Textarea
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Enter the meaning or definition"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveWordMutation.isPending}>
            {saveWordMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save to Word Bank
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
