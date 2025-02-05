// app.component.ts
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MainPointComponent } from './main-point/main-point.component';
import { AdditionalPointsComponent } from './additional-points/additional-points.component';
import { DistanceService } from './distance.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'MapApplication';
  private map!: L.Map;
  private mainPointMarker?: L.Marker;
  private mainPointCircle?: L.Circle;
  private additionalPoints: L.Marker[] = [];

  private mainIcon = L.icon({
    iconUrl: 'assets/blue-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private additionalIcon = L.icon({
    iconUrl: 'assets/red-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private highlightedIcon = L.icon({
    iconUrl: 'assets/yellow-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  constructor(
    private modalService: NzModalService,
    private distanceService: DistanceService
  ) {}

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.map);
  }

  showMainPointModal() {
    const modal = this.modalService.create({
      nzTitle: 'Manage Main Point',
      nzContent: MainPointComponent,
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.updateMainPoint(result.latitude, result.longitude, result.radius);
      }
    });
  }

  showAdditionalPointsModal() {
    const modal = this.modalService.create({
      nzTitle: 'Add Additional Points',
      nzContent: AdditionalPointsComponent,
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.addAdditionalPoint(result.latitude, result.longitude);
      }
    });
  }

  updateMainPoint(lat: number, lng: number, radius: number) {
    if (this.mainPointMarker) {
      this.mainPointMarker.remove();
    }
    if (this.mainPointCircle) {
      this.mainPointCircle.remove();
    }
    this.mainPointMarker = L.marker([lat, lng], { icon: this.mainIcon }).addTo(
      this.map
    );
    this.mainPointCircle = L.circle([lat, lng], {
      radius: radius,
      color: 'green',
    }).addTo(this.map);
    this.distanceService.setMainPoint(lat, lng);
    this.bindMarkerEvents(this.mainPointMarker, { lat, lng, radius });
    this.checkAdditionalPoints();
  }

  addAdditionalPoint(lat: number, lng: number) {
    const marker = L.marker([lat, lng], { icon: this.additionalIcon }).addTo(
      this.map
    );
    this.additionalPoints.push(marker);
    this.bindMarkerEvents(marker, { lat, lng });
    this.checkAdditionalPoints();
  }

  // check if additional points are within the radius of the main point
  checkAdditionalPoints() {
    if (!this.mainPointCircle) return;
    const radius = this.mainPointCircle.getRadius();
    const center = this.mainPointCircle.getLatLng();
    let countInside = 0;

    this.additionalPoints.forEach((marker) => {
      const distance = center.distanceTo(marker.getLatLng());
      if (distance <= radius) {
        marker.setIcon(this.highlightedIcon);
        countInside++;
      } else {
        console.log(marker.getLatLng());
        marker.setIcon(this.additionalIcon);
      }
    });

    console.log(`Count of additional points within radius: ${countInside}`);
  }

  // display details when user clicks on main or additional points
  private bindMarkerEvents(
    marker: L.Marker,
    data: { lat: number; lng: number; radius?: number }
  ) {
    marker.on('click', () => {
      console.log('Marker clicked', data);
      const lat = Number(data.lat);
      const lng = Number(data.lng);
      const radius = Number(data.radius);
      const distance = radius
        ? radius
        : this.distanceService.calculateDistance(lat, lng);

      L.popup()
        .setLatLng([lat, lng])
        .setContent(
          `Latitude: ${lat.toFixed(3)}, Longitude: ${lng.toFixed(
            3
          )}, Distance: ${distance.toFixed(2)} m`
        )
        .openOn(this.map);
    });
  }
}
