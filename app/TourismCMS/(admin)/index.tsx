import { Redirect } from 'expo-router';

/**
 * Admin Index - Redirects to Dashboard
 *
 * This file serves as the default route for /TourismCMS/(admin)
 * Instead of showing a separate landing page, it redirects users
 * directly to the dashboard which has proper RBAC protection
 * and more comprehensive functionality.
 */
export default function AdminIndex() {
  return <Redirect href="/TourismCMS/(admin)/dashboard" />;
}
