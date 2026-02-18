import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { installOpenAIRequestBlocker } from '@/lib/security/blockOpenAIRequests';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pages
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import FriendChatPage from './pages/FriendChatPage';
import Day1LearningHubPage from './pages/Day1LearningHubPage';
import Day1TestPage from './pages/Day1TestPage';
import MyProgressPage from './pages/MyProgressPage';
import SettingsPage from './pages/SettingsPage';
import ProAIInterviewerPage from './pages/ProAIInterviewerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function DailyReminderBanner() {
  const { showInAppReminder, reminderMessage, dismissInAppReminder } = useDailyReminder();

  if (!showInAppReminder) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert className="border-2 border-primary shadow-lg">
        <Bell className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-2">
          <span className="flex-1">{reminderMessage}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismissInAppReminder}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <DailyReminderBanner />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

function App() {
  useEffect(() => {
    installOpenAIRequestBlocker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
});

const comingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coming-soon',
  component: ComingSoonPage,
});

const friendChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/friend-chat',
  component: FriendChatPage,
});

const day1LearningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/day1-learning',
  component: Day1LearningHubPage,
});

const day1TestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/day1-test',
  component: Day1TestPage,
});

const myProgressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-progress',
  component: MyProgressPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const proAIInterviewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pro-ai-interviewer',
  component: ProAIInterviewerPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  comingSoonRoute,
  friendChatRoute,
  day1LearningRoute,
  day1TestRoute,
  myProgressRoute,
  settingsRoute,
  proAIInterviewerRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default App;
