import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { SiteHeader } from "@/pages/landing/components/site-header";
import { SiteFooter } from "@/pages/landing/components/site-footer";
import { SignInCard } from "./components/sign-in-card";

interface LocationState {
  from?: { pathname?: string };
}

/**
 * Sign In (`/sign-in`) — the coach's login screen. Single-owner authentication:
 * Google + Apple OAuth, email/password, and password reset. No public sign-up.
 *
 * If the coach is already signed in, we skip the form and send them straight to
 * the admin (or the protected route they were bounced from).
 */
export default function SignIn() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && user) {
    const from = (location.state as LocationState)?.from?.pathname;
    return <Navigate to={from ?? "/admin/bookings"} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mt-2">
            <SignInCard />
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

