import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useIsStripeConfigured,
  useSetStripeConfiguration,
} from "../hooks/useStripe";

export default function StripeSetup() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const { mutateAsync: setConfig, isPending } = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) return;
    try {
      await setConfig({
        secretKey: secretKey.trim(),
        allowedCountries: ["US", "CA", "GB", "AU", "PK"],
      });
      toast.success("Stripe configured successfully!");
      setSecretKey("");
    } catch {
      toast.error("Failed to configure Stripe. Please try again.");
    }
  };

  if (isLoading) return null;

  if (isConfigured) {
    return (
      <div
        className="flex items-center gap-2 mb-6"
        data-ocid="stripe.success_state"
      >
        <Badge
          variant="secondary"
          className="gap-1.5 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Stripe ✓ Configured
        </Badge>
      </div>
    );
  }

  return (
    <Card
      className="mb-6 border-amber-200 bg-amber-50"
      data-ocid="stripe.panel"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-base text-amber-900">
            Set Up Stripe Payments
          </CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Configure your Stripe secret key to enable the $2 expert subscription
          payment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex gap-3"
          data-ocid="stripe.form"
        >
          <div className="flex-1">
            <Label htmlFor="stripe-key" className="sr-only">
              Stripe Secret Key
            </Label>
            <Input
              id="stripe-key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              className="bg-white border-amber-200"
              required
              data-ocid="stripe.input"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || !secretKey.trim()}
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            data-ocid="stripe.submit_button"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isPending ? "Saving..." : "Save Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
