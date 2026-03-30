import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useVerifySubscription } from "../hooks/useStripe";

export default function PaymentSuccessPage() {
  const { mutateAsync: verifySubscription } = useVerifySubscription();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(
      window.location.hash.split("?")[1] ?? "",
    );
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setLoading(false);
      setError("No session ID found.");
      return;
    }

    verifySubscription(sessionId)
      .then((ok) => {
        setVerified(ok);
        if (!ok) setError("Could not verify payment. Please contact support.");
      })
      .catch(() => setError("Verification failed. Please contact support."))
      .finally(() => setLoading(false));
  }, [verifySubscription]);

  return (
    <div
      className="container mx-auto px-4 py-20 max-w-md text-center"
      data-ocid="payment_success.panel"
    >
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          {loading ? (
            <Loader2
              className="w-16 h-16 animate-spin text-primary mx-auto"
              data-ocid="payment_success.loading_state"
            />
          ) : error ? (
            <div
              className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto"
              data-ocid="payment_success.error_state"
            >
              <span className="text-3xl">⚠️</span>
            </div>
          ) : (
            <div
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
              data-ocid="payment_success.success_state"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
          )}
          <CardTitle className="text-2xl mt-4">
            {loading
              ? "Verifying Payment..."
              : error
                ? "Verification Issue"
                : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!loading && (
            <>
              <p className="text-muted-foreground">
                {error
                  ? error
                  : verified
                    ? "Your subscription is active. You can now create your expert profile."
                    : "Payment processed. You can now set up your profile."}
              </p>
              <Button
                asChild
                size="lg"
                className="w-full"
                data-ocid="payment_success.primary_button"
              >
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
