import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <img
            src="/assets/logo.png"
            alt="One Tap Service"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.home.link"
          >
            Home
          </Link>
          <Link
            to="/experts"
            className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.experts.link"
          >
            Find Experts
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.dashboard.link"
          >
            Expert Dashboard
          </Link>
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-2">
          {isInitializing ? (
            <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
          ) : isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              data-ocid="nav.logout.button"
            >
              Log Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
            >
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileOpen((v) => !v)}
          data-ocid="nav.mobile.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pb-4 flex flex-col gap-1">
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.mobile.home.link"
          >
            Home
          </Link>
          <Link
            to="/experts"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.mobile.experts.link"
          >
            Find Experts
          </Link>
          <Link
            to="/dashboard"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.mobile.dashboard.link"
          >
            Expert Dashboard
          </Link>
          <div className="pt-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="w-full"
                data-ocid="nav.mobile.logout.button"
              >
                Log Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full"
                data-ocid="nav.mobile.login.button"
              >
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
