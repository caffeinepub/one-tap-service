import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ServiceCategory, backendInterface } from "../backend";
import { useActor } from "./useActor";

// Extended interface for OTP methods not yet in the auto-generated backendInterface
interface OTPCapableActor extends backendInterface {
  isPhoneVerified(): Promise<boolean>;
  getVerifiedPhone(): Promise<string | null>;
}

export function useGetAllExperts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["experts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExperts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExpertsByCategory(category: ServiceCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["experts", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getExpertsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetOwnProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ownProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getOwnProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phoneNumber: string;
      serviceCategory: ServiceCategory;
      city: string;
      yearsOfExperience: bigint;
      bio: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createOrUpdateProfile(
        params.name,
        params.phoneNumber,
        params.serviceCategory,
        params.city,
        params.yearsOfExperience,
        params.bio,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownProfile"] });
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
}

export function useDeleteProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteOwnProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownProfile"] });
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
}

export function useIsPhoneVerified() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isPhoneVerified"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await (actor as OTPCapableActor).isPhoneVerified();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVerifiedPhone() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["verifiedPhone"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as OTPCapableActor).getVerifiedPhone();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
