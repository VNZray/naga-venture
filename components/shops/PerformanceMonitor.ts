// Performance Monitor and User Analytics Component
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserAction {
  action: string;
  timestamp: number;
  data?: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  actions: UserAction[];
  metrics: PerformanceMetric[];
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private currentSession: UserSession | null = null;
  private sessionStartTime: number = 0;
  
  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start a new user session
  async startSession(): Promise<void> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.sessionStartTime = Date.now();
    
    this.currentSession = {
      sessionId,
      startTime: this.sessionStartTime,
      actions: [],
      metrics: [],
    };

    await this.trackAction('session_start');
  }

  // End the current session
  async endSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    await this.trackAction('session_end');
    
    // Save session data
    await this.saveSessionData();
    this.currentSession = null;
  }

  // Track user actions
  async trackAction(action: string, data?: any): Promise<void> {
    if (!this.currentSession) {
      await this.startSession();
    }

    const userAction: UserAction = {
      action,
      timestamp: Date.now(),
      data,
    };

    this.currentSession!.actions.push(userAction);
    
    // Auto-save actions periodically
    if (this.currentSession!.actions.length % 10 === 0) {
      await this.saveSessionData();
    }
  }

  // Track performance metrics
  async trackMetric(name: string, value: number): Promise<void> {
    if (!this.currentSession) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    this.currentSession.metrics.push(metric);
  }

  // Track search performance
  async trackSearch(query: string, resultCount: number, loadTime: number): Promise<void> {
    await this.trackAction('search', { query, resultCount, loadTime });
    await this.trackMetric('search_load_time', loadTime);
    await this.trackMetric('search_result_count', resultCount);
  }

  // Track shop interactions
  async trackShopInteraction(shopId: string, action: 'view' | 'tap' | 'favorite'): Promise<void> {
    await this.trackAction('shop_interaction', { shopId, interactionType: action });
  }

  // Track filter usage
  async trackFilterUsage(filters: any): Promise<void> {
    await this.trackAction('filter_applied', filters);
  }

  // Track component render time
  async trackComponentRender(componentName: string, renderTime: number): Promise<void> {
    await this.trackMetric(`${componentName}_render_time`, renderTime);
  }

  // Track location permission status
  async trackLocationPermission(granted: boolean): Promise<void> {
    await this.trackAction('location_permission', { granted });
  }

  // Get session analytics
  async getSessionAnalytics(): Promise<any> {
    if (!this.currentSession) return null;

    const sessionDuration = Date.now() - this.currentSession.startTime;
    const totalActions = this.currentSession.actions.length;
    const averageActionInterval = sessionDuration / Math.max(totalActions, 1);

    // Group actions by type
    const actionCounts: { [key: string]: number } = {};
    this.currentSession.actions.forEach(action => {
      actionCounts[action.action] = (actionCounts[action.action] || 0) + 1;
    });

    // Calculate average metrics
    const metricAverages: { [key: string]: number } = {};
    const metricGroups: { [key: string]: number[] } = {};
    
    this.currentSession.metrics.forEach(metric => {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push(metric.value);
    });

    Object.keys(metricGroups).forEach(metricName => {
      const values = metricGroups[metricName];
      metricAverages[metricName] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return {
      sessionId: this.currentSession.sessionId,
      sessionDuration,
      totalActions,
      averageActionInterval,
      actionCounts,
      metricAverages,
      startTime: this.currentSession.startTime,
    };
  }

  // Save session data to AsyncStorage
  private async saveSessionData(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const sessionKey = `session_${this.currentSession.sessionId}`;
      await AsyncStorage.setItem(sessionKey, JSON.stringify(this.currentSession));
      
      // Update session list
      const sessionList = await this.getSessionList();
      if (!sessionList.includes(this.currentSession.sessionId)) {
        sessionList.push(this.currentSession.sessionId);
        // Keep only last 10 sessions
        const recentSessions = sessionList.slice(-10);
        await AsyncStorage.setItem('user_sessions', JSON.stringify(recentSessions));
      }
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  // Get list of session IDs
  private async getSessionList(): Promise<string[]> {
    try {
      const sessionList = await AsyncStorage.getItem('user_sessions');
      return sessionList ? JSON.parse(sessionList) : [];
    } catch (error) {
      console.error('Error getting session list:', error);
      return [];
    }
  }

  // Get historical session data
  async getHistoricalSessions(): Promise<UserSession[]> {
    try {
      const sessionList = await this.getSessionList();
      const sessions: UserSession[] = [];

      for (const sessionId of sessionList) {
        const sessionData = await AsyncStorage.getItem(`session_${sessionId}`);
        if (sessionData) {
          sessions.push(JSON.parse(sessionData));
        }
      }

      return sessions;
    } catch (error) {
      console.error('Error getting historical sessions:', error);
      return [];
    }
  }

  // Get user behavior patterns
  async getUserBehaviorAnalytics(): Promise<any> {
    try {
      const sessions = await this.getHistoricalSessions();
      
      if (sessions.length === 0) return null;

      // Calculate total metrics
      let totalSessionDuration = 0;
      let totalActions = 0;
      const allActionCounts: { [key: string]: number } = {};
      const allMetricValues: { [key: string]: number[] } = {};

      sessions.forEach(session => {
        const duration = (session.endTime || Date.now()) - session.startTime;
        totalSessionDuration += duration;
        totalActions += session.actions.length;

        // Aggregate action counts
        session.actions.forEach(action => {
          allActionCounts[action.action] = (allActionCounts[action.action] || 0) + 1;
        });

        // Aggregate metric values
        session.metrics.forEach(metric => {
          if (!allMetricValues[metric.name]) {
            allMetricValues[metric.name] = [];
          }
          allMetricValues[metric.name].push(metric.value);
        });
      });

      // Calculate averages
      const averageSessionDuration = totalSessionDuration / sessions.length;
      const averageActionsPerSession = totalActions / sessions.length;

      const metricAverages: { [key: string]: number } = {};
      Object.keys(allMetricValues).forEach(metricName => {
        const values = allMetricValues[metricName];
        metricAverages[metricName] = values.reduce((sum, val) => sum + val, 0) / values.length;
      });

      // Find most common actions
      const sortedActions = Object.entries(allActionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      return {
        totalSessions: sessions.length,
        averageSessionDuration,
        averageActionsPerSession,
        totalActions,
        mostCommonActions: sortedActions,
        metricAverages,
        firstSessionTime: sessions[0]?.startTime,
        lastSessionTime: sessions[sessions.length - 1]?.startTime,
      };
    } catch (error) {
      console.error('Error getting user behavior analytics:', error);
      return null;
    }
  }

  // Clear all analytics data
  async clearAnalyticsData(): Promise<void> {
    try {
      const sessionList = await this.getSessionList();
      
      // Remove all session data
      for (const sessionId of sessionList) {
        await AsyncStorage.removeItem(`session_${sessionId}`);
      }
      
      // Clear session list
      await AsyncStorage.removeItem('user_sessions');
      
      // Reset current session
      this.currentSession = null;
    } catch (error) {
      console.error('Error clearing analytics data:', error);
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const trackComponentMount = (componentName: string) => {
    const startTime = Date.now();
    return () => {
      const renderTime = Date.now() - startTime;
      performanceMonitor.trackComponentRender(componentName, renderTime);
    };
  };

  const trackUserAction = (action: string, data?: any) => {
    performanceMonitor.trackAction(action, data);
  };

  const trackSearch = (query: string, resultCount: number, loadTime: number) => {
    performanceMonitor.trackSearch(query, resultCount, loadTime);
  };

  const trackShopInteraction = (shopId: string, action: 'view' | 'tap' | 'favorite') => {
    performanceMonitor.trackShopInteraction(shopId, action);
  };

  return {
    trackComponentMount,
    trackUserAction,
    trackSearch,
    trackShopInteraction,
  };
};

export default PerformanceMonitor;
