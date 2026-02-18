import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, X, AlertCircle } from 'lucide-react';
import { validateHttpUrl } from '@/lib/news/validateHttpUrl';
import { getFallbackUrl, setFallbackUrl, clearFallbackUrl } from '@/lib/news/fallbackNewsUrlStorage';

interface NewsFallbackInAppBrowserProps {
  regionId: string;
  regionName: string;
}

export function NewsFallbackInAppBrowser({ regionId, regionName }: NewsFallbackInAppBrowserProps) {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);

  // Load saved URL on mount
  useEffect(() => {
    const savedUrl = getFallbackUrl(regionId);
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, [regionId]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setValidationError('');
    // Persist the URL as user types
    if (value.trim()) {
      setFallbackUrl(regionId, value);
    } else {
      clearFallbackUrl(regionId);
    }
  };

  const handleOpen = () => {
    const validation = validateHttpUrl(url);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid URL');
      return;
    }

    setOpenedUrl(validation.normalizedUrl || url);
    setValidationError('');
  };

  const handleClose = () => {
    setOpenedUrl(null);
  };

  if (openedUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Viewing: {openedUrl}</p>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
        <div className="relative w-full" style={{ height: '600px' }}>
          <iframe
            src={openedUrl}
            className="w-full h-full border-2 rounded-lg"
            title={`News from ${regionName}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No news available for {regionName} at the moment. You can paste a news website link to view it here.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor={`url-input-${regionId}`}>News Website URL</Label>
        <div className="flex gap-2">
          <Input
            id={`url-input-${regionId}`}
            type="url"
            placeholder="https://example.com/news"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={validationError ? 'border-destructive' : ''}
          />
          <Button onClick={handleOpen} disabled={!url.trim()}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
        {validationError && (
          <p className="text-sm text-destructive">{validationError}</p>
        )}
      </div>
    </Card>
  );
}
