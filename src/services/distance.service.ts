import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  private mainPoint?: L.LatLng;

  setMainPoint(lat: number, lng: number) {
    this.mainPoint = L.latLng(lat, lng);
  }

  // calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lng1: number): number {
    if (!this.mainPoint) return 0;
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (this.mainPoint.lat * Math.PI) / 180;
    const Δφ = ((lat1 - this.mainPoint.lat) * Math.PI) / 180;
    const Δλ = ((lng1 - this.mainPoint.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }
}
