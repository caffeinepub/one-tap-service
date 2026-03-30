import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface StripeConfiguration {
  secretKey: string;
  allowedCountries: string[];
}

export interface ShoppingItem {
  currency: string;
  productName: string;
  productDescription: string;
  priceInCents: bigint;
  quantity: bigint;
}

export function useHasSubscription() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["hasSubscription"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await (actor as any).hasSubscription();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubscriptionExpiry() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint | null>({
    queryKey: ["subscriptionExpiry"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getSubscriptionExpiry();
        if (Array.isArray(result)) return result[0] ?? null;
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await (actor as any).createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result);
      if (!session?.url) throw new Error("Invalid session response");
      return { id: session.id as string, url: session.url as string };
    },
  });
}

export function useVerifySubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).verifyAndActivateSubscription(
        sessionId,
      ) as Promise<boolean>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasSubscription"] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return (await (actor as any).isStripeConfigured()) as boolean;
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}
