import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  LogIn,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import PhoneVerificationModal from "../components/PhoneVerificationModal";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsPhoneVerified } from "../hooks/useQueries";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "../lib/categoryConfig";

export default function ExpertDetailPage() {
  const { principalId } = useParams({ strict: false }) as {
    principalId: string;
  };
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: isPhoneVerified, refetch: refetchVerification } =
    useIsPhoneVerified();
  const queryClient = useQueryClient();

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const { data: expert, isLoading } = useQuery({
    queryKey: ["expert", principalId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const p = Principal.fromText(principalId);
        return await actor.getExpert(p);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!principalId,
  });

  const handleVerified = () => {
    setVerifyModalOpen(false);
    refetchVerification();
    queryClient.invalidateQueries({ queryKey: ["isPhoneVerified"] });
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-10 max-w-2xl"
        data-ocid="expert_detail.loading_state"
      >
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!expert) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="expert_detail.error_state"
      >
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">
          Expert not found
        </h2>
        <p className="text-muted-foreground mb-6">
          This profile may no longer exist.
        </p>
        <Button asChild variant="outline" data-ocid="expert_detail.back.button">
          <Link to="/experts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Experts
          </Link>
        </Button>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[expert.serviceCategory];
  const colorClass = CATEGORY_COLORS[expert.serviceCategory];
  const initials = expert.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const canCall = isLoggedIn && isPhoneVerified;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2"
        data-ocid="expert_detail.back.button"
      >
        <Link to="/experts">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Experts
        </Link>
      </Button>

      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/30 p-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-3xl">
              {initials}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                {expert.name}
              </h1>
              <Badge
                variant="outline"
                className={`mt-2 border ${colorClass} inline-flex items-center gap-1.5`}
              >
                <Icon className="w-3.5 h-3.5" />
                {CATEGORY_LABELS[expert.serviceCategory]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{expert.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium">
                  {Number(expert.yearsOfExperience)} years
                </p>
              </div>
            </div>
          </div>

          {expert.bio && (
            <div className="mb-6">
              <h2 className="font-display font-semibold text-base mb-2">
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {expert.bio}
              </p>
            </div>
          )}

          {/* Call CTA */}
          {canCall ? (
            <Button
              asChild
              size="lg"
              className="w-full gap-2 shadow-orange"
              data-ocid="expert_detail.call.button"
            >
              <a href={`tel:${expert.phoneNumber}`}>
                <Phone className="w-5 h-5" />
                Call Now — {expert.phoneNumber}
              </a>
            </Button>
          ) : !isLoggedIn ? (
            <div
              className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center"
              data-ocid="expert_detail.login_prompt.panel"
            >
              <LogIn className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="font-semibold text-amber-900 mb-1">
                Login & Verify to Call
              </p>
              <p className="text-sm text-amber-700 mb-4">
                You need to log in and verify your phone number to view contact
                details and call this expert.
              </p>
              <Button
                asChild
                size="sm"
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                data-ocid="expert_detail.login.button"
              >
                <Link to="/dashboard">
                  <LogIn className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div
              className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center"
              data-ocid="expert_detail.verify_prompt.panel"
            >
              <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-900 mb-1">
                Verify your number to call
              </p>
              <p className="text-sm text-blue-700 mb-4">
                Please verify your phone number to view contact details and call
                this expert.
              </p>
              <Button
                size="sm"
                onClick={() => setVerifyModalOpen(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                data-ocid="expert_detail.verify_phone.button"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Phone Number
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Phone Verification Modal */}
      {actor && (
        <PhoneVerificationModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          onVerified={handleVerified}
          actor={actor}
        />
      )}
    </div>
  );
}
