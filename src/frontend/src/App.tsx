import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import FriendChatPage from './pages/FriendChatPage';
import Day1LearningHubPage from './pages/Day1LearningHubPage';
import Day1TestPage from './pages/Day1TestPage';
import MyProgressPage from './pages/MyProgressPage';
import SettingsPage from './pages/SettingsPage';
import ProAIInterviewerPage from './pages/ProAIInterviewerPage';
import { Toaster } from '@/components/ui/sonner';
import { installOpenAIRequestBlocker } from '@/lib/security/blockOpenAIRequests';

// Root layout component
function RootLayout() {
  // Install OpenAI request blocker on app startup
  useEffect(() => {
    installOpenAIRequestBlocker();
  }, []);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// News route
const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
});

// Friend chat route
const friendChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat-with-friend',
  component: FriendChatPage,
});

// Day 1 Learning Hub route
const day1LearnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/day1-learn',
  component: Day1LearningHubPage,
});

// Day 1 Test route
const day1TestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/day1-test',
  component: Day1TestPage,
});

// My Progress route
const myProgressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-progress',
  component: MyProgressPage,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// Pro AI Interviewer route
const proAIInterviewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pro-ai-interviewer',
  component: ProAIInterviewerPage,
});

// Coming soon route with optional feature parameter
const comingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coming-soon/$feature',
  component: ComingSoonPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  newsRoute,
  friendChatRoute,
  day1LearnRoute,
  day1TestRoute,
  myProgressRoute,
  settingsRoute,
  proAIInterviewerRoute,
  comingSoonRoute,
]);

const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
