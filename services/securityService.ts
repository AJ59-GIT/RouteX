
import { analyticsService } from './analyticsService';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15;
let requestCount = 0;
let lastWindowStart = Date.now();

// Mock Secret for Signature (In production, this stays on the server)
const MOCK_JWT_SECRET = "omni_transit_secret_2024_secure_gate";

export const securityService = {
  /**
   * Simulates a server-side leaky bucket rate limiter.
   */
  checkRateLimit: (): boolean => {
    const now = Date.now();
    if (now - lastWindowStart > RATE_LIMIT_WINDOW) {
      requestCount = 0;
      lastWindowStart = now;
    }
    
    if (requestCount >= MAX_REQUESTS) {
      analyticsService.trackEvent('security_rate_limit_hit');
      return false;
    }
    
    requestCount++;
    return true;
  },

  /**
   * Generates a Secure Signed Transit Token (STT).
   * Structure: Header.Payload.Signature (Simulating JWT)
   */
  generateSignedTransitToken: (bookingId: string, userId: string): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "STT" }));
    const payload = btoa(JSON.stringify({
      bid: bookingId,
      uid: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + (24 * 60 * 60 * 1000)) / 1000), // 24h expiry
      iss: "OmniRoute-Secure-Gateway"
    }));
    
    // Simulate a signature using a simple hash-like string
    const signature = btoa(`${header}.${payload}.${MOCK_JWT_SECRET}`).slice(0, 32);
    
    return `${header}.${payload}.${signature}`;
  },

  authenticateBiometric: async (): Promise<boolean> => {
    if (!window.PublicKeyCredential) {
      console.warn("WebAuthn not supported, using fallback PIN simulation");
      return true; 
    }
    
    try {
      analyticsService.trackEvent('security_biometric_attempt');
      // In a real app, this would be a navigator.credentials.get() call
      await new Promise(r => setTimeout(r, 800));
      return true;
    } catch (e) {
      return false;
    }
  },

  exportUserData: (data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniroute_export_${new Date().toISOString()}.json`;
    a.click();
    analyticsService.trackEvent('privacy_data_exported');
  }
};
