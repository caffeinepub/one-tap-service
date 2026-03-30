import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ExpertDetailPage from "./pages/ExpertDetailPage";
import ExpertsPage from "./pages/ExpertsPage";
import HomePage from "./pages/HomePage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const expertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/experts",
  component: ExpertsPage,
});

const expertDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/experts/$principalId",
  component: ExpertDetailPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  expertsRoute,
  expertDetailRoute,
  dashboardRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
