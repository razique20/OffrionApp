# Complete AI Prompt to Build the Offrion React Native Mobile App

Copy everything below the horizontal line and paste it into ChatGPT, Claude, or Gemini to start building your React Native (or Flutter) mobile app. You can modify the **[Fill in ...]** sections to specify exactly what the app should focus on (e.g., Merchant Dashboard, Partner Dashboard, or a Consumer Deal-Claiming App).

---

You are an expert mobile app developer specializing in React Native (Expo) and TypeScript. 

I need you to build a cross-platform mobile app (iOS and Android) for my existing Deal-as-a-Service Infrastructure platform called **Offrion**. 

### 1. Project Context
Offrion is a platform that connects **Merchants** (who create deals/discounts) and **Partners** (who distribute deals). 
The backend is already fully built using **Next.js App Router API**, **MongoDB (Mongoose)**, and **JWT-based Authentication**.

**App Goal:**
*This mobile app is specifically for: [Fill in: E.g., Merchants to manage deals, track transactions, and view analytics on the go / OR / Consumers to browse deals and partners to track commissions based on traction]*

### 2. Tech Stack Requirements
Please scaffold the project using the following stack:
- **Framework:** React Native with Expo (Expo Router for navigation)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (using nativewind) or UI library (e.g., react-native-paper, tamagui)
- **State Management:** Zustand (for global state like user profile, auth token, and subscription status)
- **Data Fetching:** TanStack Query (React Query) or generic unstorage `fetch` hook
- **Icons:** Expo Vector Icons / Lucide React Native
- **Storage:** Expo SecureStore (for JWTs)

### 3. Existing Backend Authentication
- **Token Type:** JSON Web Token (JWT)
- **Auth Flow:** The app should send a `POST` to `/api/auth/login` with `{ email, password }`. The backend responds with a JSON payload containing the user object and a JWT (or sets it in a cookie, so handle generic `Authorization: Bearer <token>` in headers or cookie parsing).
- **Endpoint:** `POST {API_BASE_URL}/api/auth/login`
- **Endpoint:** `GET {API_BASE_URL}/api/auth/me` (to fetch currently authenticated user)
- **User Roles:** `merchant`, `partner`, `admin`, `super_admin`. (Store the current role in Zustand state to manage protected routes).

### 4. Data Models (Available on the Backend)
Here are the key Mongoose schemas available on the backend that you will interact with. Please create TypeScript interfaces for these:

**1. User (`IUser`)**
```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'merchant' | 'partner' | 'admin' | 'super_admin';
  isActive: boolean;
}
```

**2. Deal (`IDeal`)**
```typescript
interface IDeal {
  _id: string;
  merchantId: string;
  categoryId: string;
  title: string;
  description: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  eventType: 'general' | 'holiday' | 'flash' | 'seasonal' | 'clearance';
  dealType: 'percentage' | 'flat' | 'bogo' | 'free-item';
  location: { type: 'Point', coordinates: [number, number] }; // [longitude, latitude]
  validFrom: Date;
  validUntil: Date;
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  isActive: boolean;
}
```

**3. Transaction (`ITransaction`)**
```typescript
interface ITransaction {
  _id: string;
  dealId: string;
  merchantId: string;
  partnerId: string;
  userId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  redeemedAt?: Date;
  qrCode?: string;
}
```

**4. Commission (`ICommission`)**
```typescript
interface ICommission {
  _id: string;
  transactionId: string;
  partnerId: string;
  merchantId: string;
  amount: number;
  partnerShare: number;
  platformShare: number;
  status: 'pending' | 'cleared' | 'paid';
}
```

**5. Subscription (`ISubscription`)**
```typescript
interface ISubscription {
  _id: string;
  userId: string;
  plan: 'merchant_free' | 'merchant_pro' | 'merchant_enterprise' | 'partner_free' | 'partner_pro' | 'partner_enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  features: string[];
}
```

### 5. Key Screens to Build
Please provide the complete code, component by component, for the following screens using Expo Router:

1. **Authentication:**
   - **Login Screen:** Email and password input, Submit button. Handles `/api/auth/login` and saves token to SecureStore.
   - **Splash/Loading Screen:** Checks SecureStore for token. If found, hits `/api/auth/me`. If valid, navigate to Main App; if not, go to Login.

2. **Main Application (Bottom Tab Navigation):**
   - **Home/Dashboard Screen:** Fetch and display a quick summary (Active Deals, Recent Traction/Transactions overview) from `/api/deals` or `/api/merchant/dashboard`.
   - **Deals List Screen:** A FlatList fetching from `/api/deals` or `/api/deals/search`. Show `title`, `images[0]`, `discountPercentage`, and `originalPrice`. Include filtering by tags or `eventType`.
   - **Deal Details Screen:** Shows full deal description, map location (using `react-native-maps` with `location.coordinates`), QR code for redeeming (`transaction.qrCode` usage), and an Action Button.
   - **Wallet / Reports Screen (Traction & Commissions):** A screen that fetches a list of `ITransaction` and `ICommission` items. Shows an aggregated view (e.g., "Total Earnings / Partner Share") and list of successful redeemed deals.
   - **Settings/Profile Screen:** Shows user `name`, `email`, `role`. Also fetch and display current user's **Subscription status** (`plan` and `status`). Include a "Logout" button (which clears SecureStore and routes back to Login).

### 6. Architectural Setup Rules
- Keep the components modular.
- Create an `api.ts` or `axios.ts` instance interceptor that automatically attaches the JWT from SecureStore to every outgoing request heading to `API_BASE_URL`.
- Handle Loading, Error, and Empty states gracefully using React Native standard UX practices.
- Give me the `app/_layout.tsx`, `app/index.tsx` (Splash), `app/(auth)/login.tsx`, and the main `app/(tabs)/_layout.tsx` structure first.

**Please start by initializing the Expo project structure, giving me the shell commands to install the necessary dependencies, and writing the Axios/Fetch interceptor + Zustand store for authentication and subscription data.**
