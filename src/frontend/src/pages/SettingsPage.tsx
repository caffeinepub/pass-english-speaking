import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Settings as SettingsIcon, Info, CheckCircle2, XCircle, Ban } from 'lucide-react';
import { useLocalSettings } from '@/hooks/useLocalSettings';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { 
    settings, 
    updateOpenAIKey, 
    updateGeminiKey, 
    updateExternalLinks, 
    updateWebsiteApiKeys,
    updateOpenAIEnabled,
    updateGeminiEnabled,
    openaiStatus,
    geminiStatus,
  } = useLocalSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="mb-4 glass-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2 neon-text">Settings</h1>
          <p className="text-purple-200">Configure your learning experience</p>
        </header>

        {/* Info Alert */}
        <Alert className="mb-6 glass-card border-cyan-400/50">
          <Info className="h-4 w-4 text-cyan-400" />
          <AlertTitle className="text-cyan-400">Local Storage Only</AlertTitle>
          <AlertDescription className="text-sm text-purple-100">
            All settings are stored locally in your browser and never transmitted to any server.
          </AlertDescription>
        </Alert>

        {/* API Keys Card */}
        <Card className="mb-6 glass-card border-purple-400/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <SettingsIcon className="w-5 h-5 text-cyan-400 neon-icon" />
              API Integration
            </CardTitle>
            <CardDescription className="text-purple-200">
              Configure OpenAI (ChatGPT) and Google Gemini API keys for AI features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OpenAI Key */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai-key" className="text-white">OpenAI (ChatGPT) API Key</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="openai-toggle" className="text-sm text-purple-200">Enable</Label>
                  <Switch
                    id="openai-toggle"
                    checked={settings.openaiEnabled}
                    onCheckedChange={updateOpenAIEnabled}
                  />
                </div>
              </div>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={settings.openaiKey}
                onChange={(e) => updateOpenAIKey(e.target.value)}
                className="glass-input"
              />
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {openaiStatus.status === 'connected' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Connected</span>
                  </>
                )}
                {openaiStatus.status === 'error' && (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Error: {openaiStatus.reason}</span>
                  </>
                )}
                {openaiStatus.status === 'disabled' && (
                  <>
                    <Ban className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400 font-medium">Disabled</span>
                  </>
                )}
              </div>
              <p className="text-xs text-purple-300">
                If present and enabled, AI Friend and UPSC Interview will use AI mode. If empty, invalid, or disabled, offline mode is used.
              </p>
            </div>

            {/* Gemini Key */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="gemini-key" className="text-white">Google Gemini API Key</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="gemini-toggle" className="text-sm text-purple-200">Enable</Label>
                  <Switch
                    id="gemini-toggle"
                    checked={settings.geminiEnabled}
                    onCheckedChange={updateGeminiEnabled}
                  />
                </div>
              </div>
              <Input
                id="gemini-key"
                type="password"
                placeholder="Enter your Gemini API key..."
                value={settings.geminiKey}
                onChange={(e) => updateGeminiKey(e.target.value)}
                className="glass-input"
              />
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {geminiStatus.status === 'connected' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Connected</span>
                  </>
                )}
                {geminiStatus.status === 'error' && (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Error: {geminiStatus.reason}</span>
                  </>
                )}
                {geminiStatus.status === 'disabled' && (
                  <>
                    <Ban className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400 font-medium">Disabled</span>
                  </>
                )}
              </div>
              <p className="text-xs text-purple-300">
                Alternative AI provider for enhanced features. Stored locally in your browser only.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* External Links Card */}
        <Card className="mb-6 glass-card border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white">External Website Links</CardTitle>
            <CardDescription className="text-purple-200">
              Add external website URLs for additional resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="external-links" className="text-white">Website Links</Label>
            <Textarea
              id="external-links"
              placeholder="Enter website URLs (one per line)..."
              value={settings.externalLinks}
              onChange={(e) => updateExternalLinks(e.target.value)}
              rows={4}
              className="glass-input"
            />
            <p className="text-xs text-purple-300">
              Optional external resources. Stored locally in your browser only.
            </p>
          </CardContent>
        </Card>

        {/* Website API Keys Card */}
        <Card className="mb-6 glass-card border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white">Website API Keys</CardTitle>
            <CardDescription className="text-purple-200">
              Configure API keys for external website integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="website-api-keys" className="text-white">API Keys</Label>
            <Textarea
              id="website-api-keys"
              placeholder="Enter API keys for external websites..."
              value={settings.websiteApiKeys}
              onChange={(e) => updateWebsiteApiKeys(e.target.value)}
              rows={4}
              className="glass-input"
            />
            <p className="text-xs text-purple-300">
              Optional API keys for external services. Stored locally in your browser only.
            </p>
          </CardContent>
        </Card>

        {/* Error Handling Info */}
        <Alert className="glass-card border-purple-400/30">
          <Info className="h-4 w-4 text-purple-300" />
          <AlertTitle className="text-white">Error Handling</AlertTitle>
          <AlertDescription className="text-sm text-purple-200">
            If an API key is invalid or connection fails, the app will show "Connection Error" and automatically switch to offline mode with pre-set lessons.
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-purple-300 border-t border-purple-400/30 pt-8 pb-8">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'pass-english-speaking'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-medium neon-text"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
