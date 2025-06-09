# Authentication System Overhaul Plan for TourismCMS (Final Version with TanStack Query)

## 1. Diagnosis of Current Issues

The TourismCMS application exhibited critical authentication vulnerabilities, allowing access with incorrect credentials or defaulting to cached sessions. The application state was not reliably reflecting the true authentication status after failed login attempts.

## 2. Root Cause Analysis (Simplified by New Approach)

Previous issues stemmed from complex manual state management. The new, robust approach simplifies this by:
*   **Relying on `onAuthStateChange`:** This Supabase event listener is the single source of truth for session state changes.
*   **Explicit `signOut()` before `signInWithEmail()`:** This is a critical step to prevent issues with lingering old sessions if a new sign-in attempt fails. Any existing session is cleared before attempting a new one.
*   **Using TanStack Query for Profile:** This library declaratively handles user profile fetching, caching, background updates, loading states, and error states.

## 3. Implemented Solution in `context/AuthContext.tsx`

The `AuthContext.tsx` has been updated to a final, polished version incorporating these principles. Key aspects of this implementation:

### 3.1. TanStack Query for Profile Management
*   `@tanstack/react-query`'s `useQuery` hook fetches and manages the `UserProfile`.
*   The query is configured with `queryKey: ['userProfile', user?.id]` and is `enabled: !!user` (meaning it only runs when a Supabase user object exists).
*   This automatically handles profile data (`userProfile`), loading state (`isUserProfileLoading`), and error state (`userProfileError`).
*   The profile cache for a specific user is cleared on sign-out. This is achieved by calling `queryClient.removeQueries({ queryKey: ['userProfile', oldUserId] })` within the `onAuthStateChange` handler for the `SIGNED_OUT` event, using the ID of the user who just signed out.

### 3.2. Simplified `useEffect` for Auth State
*   A single `useEffect` hook is responsible for:
    *   Fetching the initial session using `supabase.auth.getSession()` on component mount.
    *   Setting an initial loading flag (`isLoadingInitial`), which is set to `false` once this initial session check completes.
    *   Subscribing to `supabase.auth.onAuthStateChange((event, newSession) => ...)`:
        *   This listener updates the local `session` state whenever Supabase reports an auth change.
        *   If `event === 'SIGNED_OUT'`: It clears the TanStack Query cache for the signed-out user's profile and resets any `authError`.
        *   If `event === 'SIGNED_IN'`: It resets any `authError`. TanStack Query handles profile fetching due to the change in the `user` object (derived from `session`).
*   The `user` object (`SupabaseUser | null`) is derived directly from the `session` state: `const user = session?.user ?? null;`.

### 3.3. Robust `signInWithEmail` Function
```typescript
const signInWithEmail = async (email: string, password: string): Promise<void> => {
  setAuthError(null);
  // This is the most robust way: sign out any lingering session first.
  await supabase.auth.signOut(); // Ensures no old session interferes
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) setAuthError(error);
  // onAuthStateChange will handle setting the session on success or reflecting the signed-out state on failure.
};
```
*   **Crucially, `supabase.auth.signOut()` is called *before* `supabase.auth.signInWithPassword()`.** This prevents a previously valid session from persisting if the new login attempt fails.
*   It sets an `authError` if `signInWithPassword` itself returns an error.
*   The `onAuthStateChange` listener is responsible for all subsequent state updates based on the outcome of these Supabase calls.

### 3.4. Simplified `signOut` Function
```typescript
const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) setAuthError(error);
  // onAuthStateChange will handle clearing the session and profile cache.
};
```
*   Calls `supabase.auth.signOut()`.
*   Sets an `authError` if the sign-out operation itself fails.
*   `onAuthStateChange` (specifically the `SIGNED_OUT` event) handles clearing the local session state and triggering the TanStack Query profile cache removal.

### 3.5. Derived `isLoading` State
The main `isLoading` state exposed by the context is a derived boolean value:
`isLoading: isLoadingInitial || (!!user && isUserProfileLoading)`
This means the application is considered to be in a "loading" state if:
1.  The initial session check is still in progress (`isLoadingInitial`).
2.  OR a user is authenticated (`!!user`), but their profile is still being fetched by TanStack Query (`isUserProfileLoading`).

### 3.6. Context Value
The `AuthContext.Provider` exposes:
*   `session` (Supabase session object) and `user` (Supabase user object).
*   The derived `isLoading` state.
*   `authError` (for errors specifically from `signInWithEmail` or `signOut` operations).
*   `signInWithEmail` and `signOut` methods.
*   `userProfile` (the application-specific user profile data from TanStack Query, defaults to `null`).
*   `isUserProfileLoading` (profile-specific loading state from TanStack Query).
*   `userProfileError` (profile-specific error state from TanStack Query).
*   Legacy `login` and `logout` methods (marked with `console.warn` for review/deprecation).
*   Role-checking utility methods (`hasRole`, `hasAnyRole`, `isAdmin`) that operate on the `userProfile`.

## 4. Testing and Validation Strategy

Thorough testing is essential after these significant changes:
1.  **Clear Application Storage:** Always start by clearing AsyncStorage (React Native) or LocalStorage (web) to ensure no stale session data interferes.
2.  **Scenario 1 (Correct Credentials):** Login succeeds, correct profile loads. Verify `authError` and `userProfileError` are `null`.
3.  **Scenario 2 (Incorrect Password - Existing User):** Login fails. User remains on login. `authError` is set. `user`, `session`, `userProfile` must be `null` (due to pre-emptive `signOut`).
4.  **Scenario 3 (Non-Existent Email):** Similar to Scenario 2; `authError` set, no user state.
5.  **Scenario 4 (Correct Credentials after Failed Attempt):** Perform Scenario 2, then log in correctly. Success expected, `authError` clears.
6.  **Scenario 5 (App Reload after Failed Login):** Perform Scenario 2, reload. App should show login page, no user logged in.
7.  **Scenario 6 (App Reload after Successful Login):** Log in, reload. User should remain logged in, profile loaded.
8.  **Scenario 7 (Sign Out and Reload):** Log in, sign out, reload. Login page expected.
9.  **Scenario 8 (Rapid/Alternating Login Attempts):** Test with different users, correct/incorrect credentials. Ensure state always reflects the latest attempt accurately.
10. **Console Log & DevTools Verification:** Use React DevTools to inspect `AuthContext` state. If TanStack Query Devtools are available, use them to monitor query states.

## 5. Expected Outcome

*   Login succeeds only with valid credentials confirmed by Supabase.
*   Failed login attempts result in a clear `authError` and an unauthenticated application state (`user`, `session`, `userProfile` are `null`).
*   No defaulting to cached sessions after failed logins due to the pre-emptive `signOut`.
*   `AuthContext` states accurately reflect the current authentication status, robustly managed by Supabase events and TanStack Query.

This implementation provides a significantly cleaner, more declarative, and reliable authentication system for TourismCMS.

