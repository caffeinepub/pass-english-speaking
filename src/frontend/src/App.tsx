import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { Toaster } from '@/components/ui/sonner';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
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

// Coming soon route with optional feature parameter
const comingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coming-soon/$feature',
  component: ComingSoonPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, newsRoute, comingSoonRoute]);

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
