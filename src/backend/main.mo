import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  module Expert {
    public func compareByYearsOfExperience(expert1 : Expert, expert2 : Expert) : Order.Order {
      Nat.compare(expert2.yearsOfExperience, expert1.yearsOfExperience);
    };
  };

  module ServiceCategory {
    public func compare(category1 : ServiceCategory, category2 : ServiceCategory) : Order.Order {
      switch (category1, category2) {
        case (#electrician, #electrician) { #equal };
        case (#electrician, _) { #less };
        case (_, #electrician) { #greater };
        case (#plumber, #plumber) { #equal };
        case (#plumber, _) { #less };
        case (_, #plumber) { #greater };
        case (#acRepair, #acRepair) { #equal };
        case (#acRepair, _) { #less };
        case (_, #acRepair) { #greater };
        case (#carpenter, #carpenter) { #equal };
        case (#carpenter, _) { #less };
        case (_, #carpenter) { #greater };
        case (#painter, #painter) { #equal };
        case (#painter, _) { #less };
        case (_, #painter) { #greater };
        case (#applianceRepair, #applianceRepair) { #equal };
        case (#applianceRepair, _) { #less };
        case (_, #applianceRepair) { #greater };
        case (#pestControl, #pestControl) { #equal };
      };
    };
  };

  type Expert = {
    name : Text;
    phoneNumber : Text;
    serviceCategory : ServiceCategory;
    city : Text;
    yearsOfExperience : Nat;
    bio : Text;
    owner : Principal;
  };

  type ServiceCategory = {
    #electrician;
    #plumber;
    #acRepair;
    #carpenter;
    #painter;
    #applianceRepair;
    #pestControl;
  };

  public type UserProfile = {
    name : Text;
  };

  let experts = Map.empty<Principal, Expert>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Kept for stable variable compatibility — no longer used
  let paidSubscriptions = Set.empty<Principal>();
  let subscriptionExpiry = Map.empty<Principal, Int>();
  let THIRTY_DAYS_NS : Int = 30 * 24 * 60 * 60 * 1_000_000_000;

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Transform for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func filterByCategory(category : ServiceCategory) : [Expert] {
    experts.values().toArray().filter(func(expert) { ServiceCategory.compare(expert.serviceCategory, category) == #equal });
  };

  // Stripe configuration
  public shared func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let config = switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Expert profile functions
  public shared ({ caller }) func createOrUpdateProfile(
    name : Text,
    phoneNumber : Text,
    serviceCategory : ServiceCategory,
    city : Text,
    yearsOfExperience : Nat,
    bio : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };
    let profile : Expert = {
      name = name;
      phoneNumber = phoneNumber;
      serviceCategory = serviceCategory;
      city = city;
      yearsOfExperience = yearsOfExperience;
      bio = bio;
      owner = caller;
    };
    experts.add(caller, profile);
  };

  public query ({ caller }) func getOwnProfile() : async Expert {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    switch (experts.get(caller)) {
      case (null) {
        Runtime.trap("Expert profile does not exist");
      };
      case (?expert) { expert };
    };
  };

  public query func getExpert(expertId : Principal) : async ?Expert {
    experts.get(expertId);
  };

  public query func getAllExperts() : async [Expert] {
    experts.values().toArray();
  };

  public query func getExpertsByCategory(category : ServiceCategory) : async [Expert] {
    filterByCategory(category);
  };

  public shared ({ caller }) func deleteOwnProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete their own profile");
    };
    if (not experts.containsKey(caller)) {
      Runtime.trap("Expert profile does not exist");
    };
    experts.remove(caller);
  };

  // Suppress unused variable warnings
  ignore paidSubscriptions.size();
  ignore subscriptionExpiry.size();
  ignore THIRTY_DAYS_NS;
};
