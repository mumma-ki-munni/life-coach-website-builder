import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { FilterProvider } from "@/lib/filter-context";
import {
  SeedDataProvider,
  SupabaseDataProvider,
} from "@/lib/data-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { ScrollToTop } from "@/components/scroll-to-top";
import AdminLayout from "./layouts/admin-layout";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import About from "./pages/about";
import Programs from "./pages/programs";
import Book from "./pages/book";
import Contact from "./pages/contact";
import SignIn from "./pages/sign-in";
import AuthCallback from "./pages/auth-callback";
import AdminBookings from "./pages/admin-bookings";
import AdminMessages from "./pages/admin-messages";
import AdminAvailability from "./pages/admin-availability";
import AdminPrograms from "./pages/admin-programs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route-group wrappers — each supplies a DataProvider (and auth gate) to the
// screens nested under it via <Outlet />.
function PublicRoutes() {
  return (
    <SupabaseDataProvider>
      <div className="theme-site min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </SupabaseDataProvider>
  );
}

function DemoRoutes() {
  return (
    <SeedDataProvider>
      <Outlet />
    </SeedDataProvider>
  );
}

function AdminRoutes() {
  return (
    <ProtectedRoute>
      <SupabaseDataProvider>
        <Outlet />
      </SupabaseDataProvider>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FilterProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public marketing + booking + auth — real data via Supabase (anon) */}
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/book" element={<Book />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>

            {/* Demo — seed data, no auth, mirrors the admin screens */}
            <Route path="/demo" element={<DemoRoutes />}>
              <Route element={<AdminLayout basePath="/demo/admin" />}>
                <Route path="admin/bookings" element={<AdminBookings />} />
                <Route path="admin/messages" element={<AdminMessages />} />
                <Route
                  path="admin/availability"
                  element={<AdminAvailability />}
                />
                <Route path="admin/programs" element={<AdminPrograms />} />
              </Route>
            </Route>

            {/* Protected admin — real data, redirects to /sign-in when signed out */}
            <Route path="/admin" element={<AdminRoutes />}>
              <Route element={<AdminLayout basePath="/admin" />}>
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route
                  path="/admin/availability"
                  element={<AdminAvailability />}
                />
                <Route path="/admin/programs" element={<AdminPrograms />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </FilterProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
