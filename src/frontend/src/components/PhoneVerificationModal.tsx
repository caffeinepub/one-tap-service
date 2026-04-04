import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { backendInterface } from "../backend";

// Extended interface for OTP methods added in the latest backend version
interface OTPCapableActor extends backendInterface {
  requestPhoneOTP(phone: string): Promise<string>;
  verifyPhoneOTP(otp: string): Promise<boolean>;
}

interface PhoneVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  actor: backendInterface;
}

type Step = "phone" | "otp";

export default function PhoneVerificationModal({
  open,
  onClose,
  onVerified,
  actor,
}: PhoneVerificationModalProps) {
  const otpActor = actor as OTPCapableActor;

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setDemoOtp("");
    setOtpError("");
    onClose();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setIsLoading(true);
    try {
      const code = await otpActor.requestPhoneOTP(phone.trim());
      setDemoOtp(code);
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setIsLoading(true);
    setOtpError("");
    try {
      const success = await otpActor.verifyPhoneOTP(otp.trim());
      if (success) {
        toast.success("Phone number verified successfully!");
        handleClose();
        onVerified();
      } else {
        setOtpError("Invalid OTP, please try again.");
      }
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="phone_verification.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">
              {step === "phone" ? "Verify Phone Number" : "Enter OTP Code"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {step === "phone"
              ? "Enter your phone number to receive a verification code."
              : "Enter the OTP code shown below to verify your number."}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form
            onSubmit={handleSendOtp}
            className="space-y-4 mt-2"
            data-ocid="phone_verification.phone.panel"
          >
            <div className="space-y-1.5">
              <Label htmlFor="phone-input">Phone Number</Label>
              <Input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9055767149"
                required
                data-ocid="phone_verification.input"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                data-ocid="phone_verification.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !phone.trim()}
                className="flex-1 gap-2"
                data-ocid="phone_verification.send_otp.submit_button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="space-y-4 mt-2"
            data-ocid="phone_verification.otp.panel"
          >
            {/* Demo OTP Display */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Demo OTP Code
              </p>
              <div className="flex items-center justify-center">
                <span className="font-mono text-4xl font-bold tracking-[0.3em] text-primary select-all">
                  {demoOtp}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Copy this code and enter it below
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="otp-input">Enter OTP</Label>
              <Input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
                placeholder="Enter 6-digit code"
                required
                className="text-center text-lg tracking-widest font-mono"
                data-ocid="phone_verification.otp.input"
              />
              {otpError && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="phone_verification.otp.error_state"
                >
                  {otpError}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setOtpError("");
                }}
                className="flex-1"
                data-ocid="phone_verification.back.button"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="flex-1 gap-2"
                data-ocid="phone_verification.verify.submit_button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
