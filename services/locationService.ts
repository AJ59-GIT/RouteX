
import { Coordinate } from '../types';

export class LocationError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
    this.name = 'LocationError';
  }
}

/**
 * Service to handle device geolocation with proper error mapping.
 */
export const locationService = {
  getCurrentPosition: (): Promise<Coordinate> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new LocationError("Geolocation is not supported by your browser.", 0));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let msg = "An unknown location error occurred.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location permission denied. Please enable it in your settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              msg = "The request to get your location timed out.";
              break;
          }
          reject(new LocationError(msg, error.code));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },

  /**
   * Mock reverse geocoding to simulate city detection or address lookup.
   */
  reverseGeocode: async (coords: Coordinate): Promise<string> => {
    // In a real app, use Google Maps Geocoding API here.
    // Simulating delay for realistic UX.
    await new Promise(r => setTimeout(r, 500));
    return "Detected Location Near " + coords.lat.toFixed(2) + ", " + coords.lng.toFixed(2);
  }
};
