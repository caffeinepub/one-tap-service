import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Expert {
    bio: string;
    yearsOfExperience: bigint;
    serviceCategory: ServiceCategory;
    owner: Principal;
    city: string;
    name: string;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
}
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
export enum ServiceCategory {
    plumber = "plumber",
    electrician = "electrician",
    painter = "painter",
    pestControl = "pestControl",
    acRepair = "acRepair",
    carpenter = "carpenter",
    applianceRepair = "applianceRepair"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(name: string, phoneNumber: string, serviceCategory: ServiceCategory, city: string, yearsOfExperience: bigint, bio: string): Promise<void>;
    deleteOwnProfile(): Promise<void>;
    getAllExperts(): Promise<Array<Expert>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExpert(expertId: Principal): Promise<Expert | null>;
    getExpertsByCategory(category: ServiceCategory): Promise<Array<Expert>>;
    getOwnProfile(): Promise<Expert>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    isStripeConfigured(): Promise<boolean>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    createCheckoutSession(items: ShoppingItem[], successUrl: string, cancelUrl: string): Promise<string>;
    hasSubscription(): Promise<boolean>;
    verifyAndActivateSubscription(sessionId: string): Promise<boolean>;
    markSubscriptionPaid(user: Principal): Promise<void>;
    getSubscriptionExpiry(): Promise<bigint | null>;
}
