import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export default function PaymentFailurePage() {
  return (
    <div
      className="container mx-auto px-4 py-20 max-w-md text-center"
      data-ocid="payment_failure.panel"
    >
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div
            className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto"
            data-ocid="payment_failure.error_state"
          >
            <XCircle className="w-9 h-9 text-destructive" />
          </div>
          <CardTitle className="text-2xl mt-4">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your payment was not completed. You can try again whenever
            you&apos;re ready.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full"
            data-ocid="payment_failure.primary_button"
          >
            <Link to="/dashboard">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
