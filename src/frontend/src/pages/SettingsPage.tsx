import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Bell, BellOff } from 'lucide-react';
import { useLocalSettings } from '@/hooks/useLocalSettings';
import { useDailyReminder } from '@/hooks/useDailyReminder';

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    settings,
    updateOpenAIKey,
    updateGeminiKey,
    updateOpenAIEnabled,
    updateGeminiEnabled,
    openaiStatus,
    geminiStatus,
  } = useLocalSettings();

  const {
    isEnabled: reminderEnabled,
    permissionStatus,
    enableReminder,
    disableReminder,
  } = useDailyReminder();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getReminderStatusText = () => {
    if (!reminderEnabled) return 'Disabled';
    if (permissionStatus === 'granted') return 'Enabled (Browser Notifications)';
    if (permissionStatus === 'denied') return 'Enabled (In-App Only)';
    return 'Enabled (Permission Pending)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your learning experience
          </p>
        </header>

        {/* Local Storage Notice */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            All settings are stored locally in your browser only and are never transmitted to any server.
          </AlertDescription>
        </Alert>

        {/* Daily Reminder Settings */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {reminderEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              Daily Reminder
            </CardTitle>
            <CardDescription>
              Get reminded to complete your daily mission and maintain your streak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="daily-reminder">Enable Daily Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Status: {getReminderStatusText()}
                </p>
              </div>
              <Switch
                id="daily-reminder"
                checked={reminderEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    enableReminder();
                  } else {
                    disableReminder();
                  }
                }}
              />
            </div>
            {reminderEnabled && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {permissionStatus === 'granted' && 'You will receive browser notifications when the app is open.'}
                  {permissionStatus === 'denied' && 'Browser notifications are blocked. You will see in-app reminders instead.'}
                  {permissionStatus === 'default' && 'Click the switch again to grant notification permission.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* OpenAI Settings */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle>OpenAI API</CardTitle>
            <CardDescription>
              Configure OpenAI integration for enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="openai-toggle">Enable OpenAI</Label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(openaiStatus.status)}
                  <p className="text-sm text-muted-foreground">
                    {openaiStatus.reason}
                  </p>
                </div>
              </div>
              <Switch
                id="openai-toggle"
                checked={settings.openaiEnabled}
                onCheckedChange={updateOpenAIEnabled}
              />
            </div>

            {settings.openaiEnabled && (
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={settings.openaiKey}
                  onChange={(e) => updateOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gemini Settings */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle>Google Gemini API</CardTitle>
            <CardDescription>
              Configure Gemini integration for enhanced features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="gemini-toggle">Enable Gemini</Label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(geminiStatus.status)}
                  <p className="text-sm text-muted-foreground">
                    {geminiStatus.reason}
                  </p>
                </div>
              </div>
              <Switch
                id="gemini-toggle"
                checked={settings.geminiEnabled}
                onCheckedChange={updateGeminiEnabled}
              />
            </div>

            {settings.geminiEnabled && (
              <div className="space-y-2">
                <Label htmlFor="gemini-key">API Key</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  value={settings.geminiKey}
                  onChange={(e) => updateGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
