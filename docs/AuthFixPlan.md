# Plan to Resolve Authentication Issues in TourismCMS

## 1. Introduction

The current authentication mechanism in `AuthContext.tsx` allows users to bypass login with incorrect credentials or non-existent emails, often defaulting to a previously cached session (e.g., `admin@nagaventures.com`). This plan outlines the steps to diagnose and rectify these critical flaws, ensuring that Supabase sign-in errors are correctly handled and unauthorized access is prevented.

## 2. Diagnosis of Key Issues

Based on the observed behavior and console logs, the primary issues stem from:

*   **A. Incorrect State Handling in `signInWithEmail` on Error:**
    *   When `supabase.auth.signInWithPassword` returns an error, the `signInWithEmail` function sets an error message and `isLoading` to `false`. However, it does **not** explicitly clear the existing `user`, `session`, or `profile` states. If these states hold data from a previous session (e.g., loaded by `getSession`), the UI might incorrectly perceive the user as still logged in with that old session's identity, despite the new login attempt failing.
*   **B. Stale Session Persistence and `getSession` Impact:**
    *   `supabase.auth.getSession()` correctly loads an existing session on application startup. If a subsequent login attempt fails, and the client-side state (`user`, `profile`) isn't cleared, the application continues to operate with this stale session information.
*   **C. Race Conditions or Delayed State Updates from `onAuthStateChange`:**
    *   The `signInWithEmail` function relies on `onAuthStateChange` to handle state updates after a successful Supabase sign-in. If a sign-in fails, `onAuthStateChange` might not fire the expected events or might not clear state quickly enough, allowing the UI to act on stale data. The critical path is ensuring that a `signInWithPassword` error *immediately* invalidates any current user/profile state in the context.
*   **D. UI Navigation Logic:**
    *   The UI (likely in `login.tsx`) might be checking `isLoading` and navigating based on the presence of `user` or `profile` data without adequately considering the `error` state or before the auth state has fully resolved after a failed attempt.

## 3. Proposed Solutions: Modifications to `AuthContext.tsx`

The following changes to `AuthContext.tsx` aim to make the authentication flow more robust:

### Step 3.1: Fortify `signInWithEmail` for Immediate State Reset on Error

The `signInWithEmail` function must be the primary gatekeeper for login attempts. If Supabase indicates a failure, `AuthContext` must immediately reflect an unauthenticated state, regardless of any prior session.

*   **Action:** Modify `signInWithEmail` so that if `signInError` occurs:
    1.  Set `setError(new Error(signInError.message || 'Sign in failed'))`.
    2.  **Crucially, explicitly set `setUser(null)`, `setSession(null)`, and `setProfile(null)`.**
    3.  Set `setIsLoading(false)`.

```tsx
// Inside AuthProvider:
const signInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  console.log('[AuthContext] signInWithEmail started.');
  setIsLoading(true);
  setError(null);
  // Clear previous user/profile state at the beginning of a new attempt
  // This is to prevent UI flicker or using stale data if the login fails
  // setUser(null); // Consider if this is too aggressive before Supabase call
  // setSession(null);
  // setProfile(null);

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      console.error(
        '[AuthContext] signInWithEmail: Supabase sign-in error:',
        signInError
      );
      setError(new Error(signInError.message || 'Sign in failed'));
      // Explicitly clear user, session, and profile on sign-in error
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsLoading(false); // Stop loading as the attempt has failed
    } else {
      console.log(
        '[AuthContext] signInWithEmail: Supabase sign-in successful. User data:', data.user?.id, 
        'Session:', data.session ? 'exists' : 'null',
        'Waiting for onAuthStateChange to handle further profile fetching.'
      );
      // On success, onAuthStateChange (event: SIGNED_IN) will be triggered.
      // It will set the session and user, and then the useEffect hook for the user
      // will fetch the profile. isLoading will be set to false by those processes.
      // No need to set isLoading(false) here directly on success of signInWithPassword.
    }
  } catch (catchedError: any) {
    console.error(
      '[AuthContext] signInWithEmail: Unexpected error:',
      catchedError
    );
    setError(
      catchedError instanceof Error
        ? catchedError
        : new Error('An unexpected error occurred during sign in.')
    );
    // Explicitly clear user, session, and profile on unexpected error
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsLoading(false); // Stop loading on unexpected error
  }
};
```

### Step 3.2: Ensure `onAuthStateChange` Correctly Handles `SIGNED_OUT` and Errors

Review the `onAuthStateChange` handler, particularly for `SIGNED_OUT` and how it interacts with profile fetching errors.

*   **Action:**
    *   When `event === 'SIGNED_OUT'`: Ensure `setUser(null)`, `setSession(null)`, `setProfile(null)`, `setError(null)`, `setIsProfileLoading(false)`, and `setIsLoading(false)` are all correctly set. This seems mostly in place but verify.
    *   If `fetchUserProfile` fails within any part of `onAuthStateChange` (e.g., in `SIGNED_IN` handler), ensure the user is effectively logged out by clearing `user`, `session`, `profile`, setting the `error`, and setting loading states to `false`.

```tsx
// Inside onAuthStateChange, within the SIGNED_IN block's try/catch/finally for fetchUserProfile:
// ...
// } catch (profileError) {
//   console.error(
//     '[AuthContext] SIGNED_IN: Error fetching profile:',
//     profileError
//   );
//   setError(
//     profileError instanceof Error
//       ? profileError
//       : new Error('Failed to fetch profile')
//   );
//   setProfile(null);
//   // If profile fetch fails after a sign-in event, also clear the user/session
//   // to ensure a consistent unauthenticated state.
//   setUser(null); // Add this
//   setSession(newSession); // Or setSession(null) if newSession should also be invalidated
//                          // This depends on whether a session without a profile is valid.
//                          // Forcing logout is safer:
//   // setSession(null); // Consider this if a profile is mandatory
// } finally {
//   setIsProfileLoading(false);
//   setIsLoading(false);
// }
// ...

// And in the SIGNED_OUT event:
// else if (event === 'SIGNED_OUT') {
//   console.log(
//     '[AuthContext] SIGNED_OUT: Clearing user, profile, and error states.'
//   );
//   // setUser(null); // Already handled by common setUser(newAuthUser) where newAuthUser is null
//   setProfile(null);
//   setError(null);
//   setIsProfileLoading(false);
//   setIsLoading(false);
//   // Ensure session is also explicitly cleared here if not already handled by setSession(newSession)
//   // setSession(null); // This is implicitly handled by setSession(newSession) which would be null
// }
```

### Step 3.3: Review `useEffect` for Profile Fetching

The `useEffect` hook that depends on `[user, profile, isProfileLoading, isLoading]` fetches the profile.

*   **Action:**
    *   Ensure that if `fetchUserProfile` within this hook fails, `profile` is set to `null`, `error` is set, and `isProfileLoading` and `isLoading` are correctly set to `false`.
    *   If `user` becomes `null` (e.g., due to a sign-out or a failed login that cleared it), this hook should ensure `profile` is also `null` and loading states are `false`. This seems to be handled by the `else if (!user)` block.

```tsx
// Inside useEffect([user, profile, isProfileLoading, isLoading]):
// ...
// .catch((profileError) => {
//   console.error(
//     '[AuthContext] User effect: Error fetching profile:',
//     profileError
//   );
//   setError(
//     profileError instanceof Error
//       ? profileError
//       : new Error('Failed to fetch profile')
//   );
//   setProfile(null); // Ensure profile is null on error
// })
// .finally(() => {
//   setIsProfileLoading(false);
//   setIsLoading(false); // Ensure isLoading is false after attempt
// });
// ...
// else if (!user) {
//   console.log(
//     '[AuthContext] User effect: User is null. Ensuring profile is null and loading states are false.'
//   );
//   setProfile(null);
//   // setSession(null); // Session should be handled by onAuthStateChange or signInWithEmail
//   if (isProfileLoading) setIsProfileLoading(false);
//   if (isLoading) setIsLoading(false);
// }
```

### Step 3.4: Simplify `isLoading` Management

The `isLoading` state seems to be managed in multiple places. Simplify its logic:
*   `isLoading` should primarily indicate the initial auth check or an active sign-in/sign-up process.
*   It should be `true` when `AuthContext` initializes and when `signInWithEmail` (or `signUp`) begins.
*   It should be set to `false` once:
    *   The initial session check (`getSession` and subsequent profile fetch, if any) completes.
    *   A `signInWithEmail` or `signUp` attempt concludes (either success with profile, or failure).
    *   A `signOut` completes.

The current logic for `isLoading` is spread across `getSession.then/catch`, `onAuthStateChange` various events, and the `useEffect` for user changes. This complexity can lead to states where `isLoading` is not correctly turned off. The most important change is ensuring `signInWithEmail` sets `isLoading = false` on any error.

## 4. Testing Strategy

After implementing the changes:

1.  **Clean State:** Clear browser cache/local storage for the site to ensure no old sessions interfere.
2.  **Scenario 1 (Incorrect Password):**
    *   Attempt login with `blmadmin@nagaventures.com` and a wrong password.
    *   **Expected:** Login fails, an error message is displayed, user remains on the login page. `user`, `session`, `profile` in context should be `null`. No redirection to dashboard.
3.  **Scenario 2 (Non-existent Email):**
    *   Attempt login with `random@example.com` and any password.
    *   **Expected:** Login fails, error message, remains on login page. `user`, `session`, `profile` are `null`.
4.  **Scenario 3 (Correct Credentials after Failed Attempt):**
    *   Perform Scenario 1. Then, attempt login with `blmadmin@nagaventures.com` and the correct password.
    *   **Expected:** Login succeeds, user is redirected to the dashboard with `blmadmin`'s profile.
5.  **Scenario 4 (App Reload after Failed Login):**
    *   Perform Scenario 1. Reload the application (Ctrl+R).
    *   **Expected:** Application loads to the login page. No user should be automatically logged in.
6.  **Scenario 5 (App Reload after Successful Login):**
    *   Log in successfully with `tcmadmin@nagaventures.com`. Reload the application.
    *   **Expected:** User remains logged in as `tcmadmin@nagaventures.com` and sees the dashboard.
7.  **Scenario 6 (Back-to-Back Logins with Different Users):**
    *   Log in as `admin@nagaventures.com`. Sign out.
    *   Log in as `tcmadmin@nagaventures.com`.
    *   **Expected:** Profile correctly reflects `tcmadmin`.
8.  **Console Log Verification:** Monitor console logs for `[AuthContext]` messages to trace state changes and ensure no unexpected errors or behaviors. Specifically, check that `signInError` in `signInWithEmail` leads to the clearing of user/session/profile.

## 5. Expected Outcome

*   Login will only succeed if Supabase authentication is successful.
*   Failed login attempts (wrong password, non-existent user) will result in an error state within `AuthContext`, and the UI will prevent access.
*   The application will no longer default to a cached admin (or any other) session after a failed login attempt.
*   The `user`, `session`, and `profile` states in `AuthContext` will accurately reflect the current authentication status.

This plan focuses on making the `AuthContext` state transitions more explicit and robust, particularly in error scenarios during login.
