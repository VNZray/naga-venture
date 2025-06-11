// filepath: services/NavigationService.ts
import { router } from 'expo-router';

/**
 * Navigation Service
 *
 * Centralized navigation service following the principle of avoiding magic strings
 * and providing a consistent way to handle navigation throughout the app.
 */

// Navigation Routes Constants
export const ROUTES = {
  TOURISM_CMS: {
    BUSINESS_MANAGEMENT: {
      ALL_BUSINESSES:
        '/TourismCMS/(admin)/business-management/business-listings/all-businesses',
      CREATE_BUSINESS:
        '/TourismCMS/(admin)/business-management/business-listings/create',
      EDIT_BUSINESS: (id: string) =>
        `/TourismCMS/(admin)/business-management/business-listings/edit/${id}`,
      VIEW_BUSINESS: (id: string) =>
        `/TourismCMS/(admin)/business-management/business-listings/view/${id}`,
    },
  },
} as const;

export class NavigationService {
  /**
   * Navigate to All Businesses page with replace
   */
  static toAllBusinesses() {
    console.log('🧭 [NavigationService] Navigating to All Businesses');
    console.log(
      '🧭 [NavigationService] Route:',
      ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.ALL_BUSINESSES
    );

    try {
      router.replace(ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.ALL_BUSINESSES);
      console.log(
        '✅ [NavigationService] Navigation to All Businesses successful'
      );
    } catch (error) {
      console.error(
        '❌ [NavigationService] Navigation to All Businesses failed:',
        error
      );
    }
  }

  /**
   * Navigate to Create Business page
   */
  static toCreateBusiness() {
    console.log('🧭 [NavigationService] Navigating to Create Business');
    console.log(
      '🧭 [NavigationService] Route:',
      ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.CREATE_BUSINESS
    );

    try {
      router.push(ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.CREATE_BUSINESS);
      console.log(
        '✅ [NavigationService] Navigation to Create Business successful'
      );
    } catch (error) {
      console.error(
        '❌ [NavigationService] Navigation to Create Business failed:',
        error
      );
    }
  }

  /**
   * Navigate to Edit Business page
   */
  static toEditBusiness(businessId: string) {
    console.log('🧭 [NavigationService] Navigating to Edit Business');
    console.log('🧭 [NavigationService] Business ID:', businessId);

    const route =
      ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.EDIT_BUSINESS(businessId);
    console.log('🧭 [NavigationService] Route:', route);

    try {
      router.push(route);
      console.log(
        '✅ [NavigationService] Navigation to Edit Business successful'
      );
    } catch (error) {
      console.error(
        '❌ [NavigationService] Navigation to Edit Business failed:',
        error
      );
    }
  }

  /**
   * Navigate to View Business page
   */
  static toViewBusiness(businessId: string) {
    console.log('🧭 [NavigationService] Navigating to View Business');
    console.log('🧭 [NavigationService] Business ID:', businessId);

    const route =
      ROUTES.TOURISM_CMS.BUSINESS_MANAGEMENT.VIEW_BUSINESS(businessId);
    console.log('🧭 [NavigationService] Route:', route);

    try {
      router.push(route);
      console.log(
        '✅ [NavigationService] Navigation to View Business successful'
      );
    } catch (error) {
      console.error(
        '❌ [NavigationService] Navigation to View Business failed:',
        error
      );
    }
  }

  /**
   * Go back in navigation stack
   */
  static goBack() {
    console.log('🧭 [NavigationService] Go back requested');
    console.log('🧭 [NavigationService] Can go back:', router.canGoBack());

    if (router.canGoBack()) {
      try {
        router.back();
        console.log('✅ [NavigationService] Go back successful');
      } catch (error) {
        console.error('❌ [NavigationService] Go back failed:', error);
        this.toAllBusinesses();
      }
    } else {
      console.log(
        '🔄 [NavigationService] Cannot go back - navigating to All Businesses'
      );
      this.toAllBusinesses();
    }
  }

  /**
   * Safe navigation with error handling
   */
  static safeNavigate(route: string, options?: { replace?: boolean }) {
    console.log('🧭 [NavigationService] Safe navigate requested');
    console.log('🧭 [NavigationService] Route:', route);
    console.log('🧭 [NavigationService] Options:', options);

    try {
      if (options?.replace) {
        router.replace(route as any);
      } else {
        router.push(route as any);
      }
      console.log('✅ [NavigationService] Safe navigation successful');
    } catch (error) {
      console.error('❌ [NavigationService] Safe navigation failed:', error);
      console.log('🔄 [NavigationService] Fallback to All Businesses');
      this.toAllBusinesses();
    }
  }
}
