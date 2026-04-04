# One Tap Service

## Current State
The app connects customers with service experts. Experts register via Internet Identity, create profiles with name, phone, service category, city, experience, and bio. Customers browse experts by category and call directly. No subscription fee (removed in Version 7). Contact/support section is live. Backend has authorization, Stripe (dormant), and HTTP outcalls.

## Requested Changes (Diff)

### Add
- Phone number OTP verification for both experts (during profile creation/update) and customers (when they try to call an expert)
- Backend storage for verified phone numbers per user principal
- OTP generation logic in backend (returns a 6-digit code)
- OTP verification endpoint that confirms the code matches and marks number as verified
- Frontend OTP modal/dialog: user enters phone, receives a simulated OTP (displayed on screen for demo), then enters it to confirm
- Verified badge shown on expert profiles in the listing
- Experts must verify their phone before their profile becomes visible to customers
- Customers must verify their phone before the "Call Now" button becomes active / shows the expert's number

### Modify
- DashboardPage: add phone verification step before profile can be saved/published (if phone not yet verified)
- ExpertsPage / ExpertDetailPage: show verified badge on expert cards
- ExpertDetailPage: require customer phone verification before revealing expert's phone number

### Remove
- Nothing removed

## Implementation Plan
1. Backend: add `verifiedPhones` map (Principal -> Text), `pendingOTPs` map (Principal -> {otp: Text, expiry: Int}), `requestPhoneOTP(phone: Text)` (generates 6-digit OTP, stores it, returns it for demo display), `verifyPhoneOTP(otp: Text)` (validates, marks phone verified), `isPhoneVerified()` query, `getVerifiedPhone()` query.
2. Frontend: create `PhoneVerificationModal` component — enter phone number, display simulated OTP prominently, enter OTP to confirm.
3. DashboardPage: check if caller's phone is verified. If not, show verification step before allowing profile save.
4. ExpertDetailPage: check if viewing customer's phone is verified; if not, show verification prompt instead of expert phone number / call button.
5. ExpertCard: show a "Verified" badge if expert is verified.
