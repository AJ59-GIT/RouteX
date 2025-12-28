
export const analyticsService = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    // In production, send to Mixpanel, PostHog, or GA4.
    console.debug(`[Analytics] ${eventName}`, properties);
  },

  trackRouteSearch: (source: string, destination: string, city: string) => {
    analyticsService.trackEvent('route_search', { source, destination, city });
  },

  trackBooking: (routeId: string, cost: number, mode: string) => {
    analyticsService.trackEvent('booking_completed', { routeId, cost, mode });
  },

  trackSustainabilityMilestone: (carbonSaved: number) => {
    analyticsService.trackEvent('carbon_saved_milestone', { amount: carbonSaved });
  }
};
