import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  LogIn,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ServiceCategory } from "../backend";
import StripeSetup from "../components/StripeSetup";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateOrUpdateProfile,
  useDeleteProfile,
  useGetOwnProfile,
} from "../hooks/useQueries";
import {
  useCreateCheckoutSession,
  useGetSubscriptionExpiry,
  useHasSubscription,
} from "../hooks/useStripe";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "../lib/categoryConfig";

type FormData = {
  name: string;
  phoneNumber: string;
  serviceCategory: ServiceCategory;
  city: string;
  yearsOfExperience: string;
  bio: string;
};

const DEFAULT_FORM: FormData = {
  name: "",
  phoneNumber: "",
  serviceCategory: ServiceCategory.electrician,
  city: "",
  yearsOfExperience: "1",
  bio: "",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useGetOwnProfile();
  const { mutateAsync: saveProfile, isPending: isSaving } =
    useCreateOrUpdateProfile();
  const { mutateAsync: deleteProfile, isPending: isDeleting } =
    useDeleteProfile();
  const { data: hasSubscription, isLoading: subscriptionLoading } =
    useHasSubscription();
  const { data: subscriptionExpiry } = useGetSubscriptionExpiry();
  const { mutateAsync: createCheckout, isPending: isCheckingOut } =
    useCreateCheckoutSession();

  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);

  useEffect(() => {
    if (actor && isLoggedIn) {
      actor
        .isCallerAdmin()
        .then(setIsAdmin)
        .catch(() => setIsAdmin(false));
    }
  }, [actor, isLoggedIn]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        serviceCategory: profile.serviceCategory,
        city: profile.city,
        yearsOfExperience: Number(profile.yearsOfExperience).toString(),
        bio: profile.bio,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile({
        name: form.name,
        phoneNumber: form.phoneNumber,
        serviceCategory: form.serviceCategory,
        city: form.city,
        yearsOfExperience: BigInt(Number.parseInt(form.yearsOfExperience) || 0),
        bio: form.bio,
      });
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile();
      setForm(DEFAULT_FORM);
      toast.success("Profile deleted.");
    } catch {
      toast.error("Failed to delete profile.");
    }
  };

  const handlePayNow = async () => {
    try {
      const origin = window.location.origin;
      const base = origin + window.location.pathname;
      const session = await createCheckout({
        items: [
          {
            currency: "usd",
            productName: "Expert Subscription",
            productDescription:
              "Monthly subscription to list your services on One Tap Service",
            priceInCents: 200n,
            quantity: 1n,
          },
        ],
        successUrl: `${base}#/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${base}#/payment-failure`,
      });
      window.location.href = session.url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Compute expiry info
  let expiryDate: Date | null = null;
  let daysRemaining: number | null = null;
  if (subscriptionExpiry != null) {
    expiryDate = new Date(Number(subscriptionExpiry) / 1_000_000);
    daysRemaining = Math.floor(
      (expiryDate.getTime() - Date.now()) / 86_400_000,
    );
  }

  if (isInitializing || (!isLoggedIn && isLoggingIn)) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="dashboard.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="container mx-auto px-4 py-20 max-w-md text-center"
        data-ocid="dashboard.login.panel"
      >
        <div className="bg-white rounded-2xl border border-border shadow-card p-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-3">
            Expert Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Log in to create or manage your expert profile and start receiving
            customer calls.
          </p>
          <Button
            size="lg"
            onClick={login}
            className="w-full gap-2"
            data-ocid="dashboard.login.button"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (profileLoading || subscriptionLoading) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="dashboard.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Admin: Stripe Setup */}
      {isAdmin && <StripeSetup />}

      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          {profile ? "Manage Your Profile" : "Create Expert Profile"}
        </h1>
        <p className="text-muted-foreground">
          {profile
            ? "Update your information so customers can find and contact you."
            : "Fill in your details to appear in the expert listing."}
        </p>
      </div>

      {/* Subscription payment wall */}
      {!hasSubscription ? (
        <Card
          className="shadow-card border-primary/20"
          data-ocid="subscription.panel"
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Monthly Expert Subscription
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Pay $2/month to create your expert profile and start receiving
              customer calls.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {expiryDate && daysRemaining !== null && daysRemaining < 0 && (
              <div
                className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                data-ocid="subscription.expired.panel"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span>
                  Your subscription expired on{" "}
                  <strong>{formatDate(expiryDate)}</strong>. Renew below to
                  reactivate your profile.
                </span>
              </div>
            )}
            <div className="inline-flex items-center justify-center">
              <Badge className="text-3xl font-bold px-6 py-3 rounded-xl bg-primary text-primary-foreground">
                $2/mo
              </Badge>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                ✅ Monthly subscription, cancel anytime
              </li>
              <li className="flex items-center gap-2">
                ✅ Appear in expert listings immediately
              </li>
              <li className="flex items-center gap-2">
                ✅ Receive direct customer calls
              </li>
              <li className="flex items-center gap-2">
                ✅ Manage your profile anytime
              </li>
            </ul>
            <Button
              size="lg"
              onClick={handlePayNow}
              disabled={isCheckingOut}
              className="w-full gap-2 text-base py-6"
              data-ocid="subscription.primary_button"
            >
              {isCheckingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              {isCheckingOut
                ? "Redirecting to payment..."
                : "Pay & Get Started"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Subscription Status Banner */}
          {expiryDate &&
            daysRemaining !== null &&
            (daysRemaining <= 7 ? (
              <div
                className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 mb-5"
                data-ocid="subscription.expiring.panel"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800">
                      Subscription expiring soon
                    </p>
                    <p className="text-amber-700 mt-0.5">
                      Your subscription expires on{" "}
                      <strong>{formatDate(expiryDate)}</strong> ({daysRemaining}{" "}
                      {daysRemaining === 1 ? "day" : "days"} left). Renew now to
                      keep your profile active.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handlePayNow}
                  disabled={isCheckingOut}
                  className="shrink-0 gap-1.5"
                  data-ocid="subscription.renew.button"
                >
                  {isCheckingOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Renew Now
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 mb-5 text-sm"
                data-ocid="subscription.active.panel"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span className="text-green-800">
                  <strong>Subscription active</strong> · Renews on{" "}
                  {formatDate(expiryDate)}
                </span>
                <CalendarClock className="w-4 h-4 shrink-0 text-green-500 ml-auto" />
              </div>
            ))}

          {/* Profile Preview */}
          {profile && (
            <Card
              className="mb-6 border-primary/20 bg-primary/5"
              data-ocid="dashboard.profile.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Your Current Profile
                </CardTitle>
                <CardDescription>
                  Visible to customers searching for{" "}
                  {CATEGORY_LABELS[profile.serviceCategory]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" /> {profile.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {profile.city}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />{" "}
                    {Number(profile.yearsOfExperience)} yrs exp
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} data-ocid="dashboard.profile.form">
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Ahmed Khan"
                    required
                    data-ocid="dashboard.name.input"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={form.phoneNumber}
                    onChange={set("phoneNumber")}
                    placeholder="e.g. +92 300 1234567"
                    required
                    type="tel"
                    data-ocid="dashboard.phone.input"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select
                    value={form.serviceCategory}
                    onValueChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        serviceCategory: v as ServiceCategory,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="category"
                      data-ocid="dashboard.category.select"
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={set("city")}
                    placeholder="e.g. Karachi"
                    required
                    data-ocid="dashboard.city.input"
                  />
                </div>

                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <Label htmlFor="exp">Years of Experience *</Label>
                  <Input
                    id="exp"
                    type="number"
                    min="0"
                    max="50"
                    value={form.yearsOfExperience}
                    onChange={set("yearsOfExperience")}
                    required
                    data-ocid="dashboard.experience.input"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={set("bio")}
                    placeholder="Describe your skills, specialties, and service areas..."
                    rows={4}
                    data-ocid="dashboard.bio.textarea"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 gap-2"
                    data-ocid="dashboard.save.submit_button"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving
                      ? "Saving..."
                      : profile
                        ? "Update Profile"
                        : "Create Profile"}
                  </Button>

                  {profile && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                          data-ocid="dashboard.delete.open_modal_button"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="dashboard.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove your expert profile.
                            Customers will no longer be able to find or contact
                            you.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="dashboard.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            data-ocid="dashboard.delete.confirm_button"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </>
      )}
    </div>
  );
}
