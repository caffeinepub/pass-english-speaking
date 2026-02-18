import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Settings as SettingsIcon, Info } from 'lucide-react';
import { useLocalSettings } from '@/hooks/useLocalSettings';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateOpenAIKey, updateGeminiKey, updateExternalLinks, updateWebsiteApiKeys } = useLocalSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your learning experience</p>
        </header>

        {/* Info Alert */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Local Storage Only</AlertTitle>
          <AlertDescription className="text-sm">
            All settings are stored locally in your browser and never transmitted to any server.
          </AlertDescription>
        </Alert>

        {/* API Keys Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              API Integration
            </CardTitle>
            <CardDescription>
              Configure OpenAI (ChatGPT) and Google Gemini API keys for AI features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OpenAI Key */}
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI (ChatGPT) API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={settings.openaiKey}
                onChange={(e) => updateOpenAIKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If present, AI Friend and UPSC Interview will use AI mode. If empty or invalid, offline mode is used.
              </p>
            </div>

            {/* Gemini Key */}
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google Gemini API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="Enter your Gemini API key..."
                value={settings.geminiKey}
                onChange={(e) => updateGeminiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Alternative AI provider for enhanced features. Stored locally in your browser only.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* External Links Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>External Website Links</CardTitle>
            <CardDescription>
              Add external website URLs for additional resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="external-links">Website Links</Label>
            <Textarea
              id="external-links"
              placeholder="Enter website URLs (one per line)..."
              value={settings.externalLinks}
              onChange={(e) => updateExternalLinks(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional external resources. Stored locally in your browser only.
            </p>
          </CardContent>
        </Card>

        {/* Website API Keys Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Website API Keys</CardTitle>
            <CardDescription>
              Configure API keys for external website integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="website-api-keys">API Keys</Label>
            <Textarea
              id="website-api-keys"
              placeholder="Enter API keys for external websites..."
              value={settings.websiteApiKeys}
              onChange={(e) => updateWebsiteApiKeys(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional API keys for external services. Stored locally in your browser only.
            </p>
          </CardContent>
        </Card>

        {/* Error Handling Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Error Handling</AlertTitle>
          <AlertDescription className="text-sm">
            If an API key is invalid or connection fails, the app will show "Connection Error" and automatically switch to offline mode with pre-set lessons.
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-8 pb-8">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'pass-english-speaking'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
