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
  CheckCircle2,
  Clock,
  Loader2,
  LogIn,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ServiceCategory } from "../backend";
import PhoneVerificationModal from "../components/PhoneVerificationModal";
import StripeSetup from "../components/StripeSetup";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateOrUpdateProfile,
  useDeleteProfile,
  useGetOwnProfile,
  useIsPhoneVerified,
} from "../hooks/useQueries";
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
  const { data: isPhoneVerified, refetch: refetchVerification } =
    useIsPhoneVerified();

  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

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

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

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

  if (profileLoading) {
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

      {/* Phone Verification Banner */}
      {isPhoneVerified ? (
        <div
          className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-green-50 border border-green-200"
          data-ocid="dashboard.phone_verified.panel"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">
              Phone Verified ✓
            </p>
            <p className="text-xs text-green-700">
              Your phone number is verified. Customers can contact you directly.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200"
          data-ocid="dashboard.phone_unverified.panel"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-800 text-sm">
              Verify your phone number
            </p>
            <p className="text-xs text-amber-700 mt-0.5 mb-3">
              Verify your phone number to publish your profile and appear in
              listings.
            </p>
            <Button
              size="sm"
              onClick={() => setVerifyModalOpen(true)}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              data-ocid="dashboard.verify_phone.button"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Phone
            </Button>
          </div>
        </div>
      )}

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
                        Customers will no longer be able to find or contact you.
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

      {/* Phone Verification Modal */}
      {actor && (
        <PhoneVerificationModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          onVerified={() => {
            setVerifyModalOpen(false);
            refetchVerification();
          }}
          actor={actor}
        />
      )}
    </div>
  );
}
