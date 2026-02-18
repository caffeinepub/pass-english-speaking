import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, X, AlertCircle } from 'lucide-react';
import { validateHttpUrl } from '@/lib/news/validateHttpUrl';
import { getPastedNewsUrl, setPastedNewsUrl, clearPastedNewsUrl } from '@/lib/news/pasteLinkStorage';

export function NewsPasteLinkInAppBrowser() {
  const [url, setUrl] = useState('');
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = getPastedNewsUrl();
    if (stored) {
      setUrl(stored);
    }
  }, []);

  const handleOpen = () => {
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const validation = validateHttpUrl(url.trim());
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setOpenedUrl(validation.normalizedUrl || url.trim());
    setPastedNewsUrl(validation.normalizedUrl || url.trim());
  };

  const handleClose = () => {
    setOpenedUrl(null);
  };

  const handleClear = () => {
    setUrl('');
    setOpenedUrl(null);
    clearPastedNewsUrl();
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrl(newValue);
    setError('');
    
    if (!newValue.trim()) {
      clearPastedNewsUrl();
    }
  };

  if (openedUrl) {
    return (
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">In-App Browser</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] border-2 border-border rounded-lg overflow-hidden">
            <iframe
              src={openedUrl}
              className="w-full h-full"
              title="News Link"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          Paste Link
        </CardTitle>
        <CardDescription>
          Enter a news website URL to open it inside the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="news-url">Website URL</Label>
          <Input
            id="news-url"
            type="text"
            placeholder="example.com or https://example.com"
            value={url}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleOpen();
              }
            }}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={handleOpen} className="flex-1">
            Open Link
          </Button>
          {url && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
