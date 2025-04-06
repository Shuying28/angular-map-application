import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MainPointComponent } from './main-point/main-point.component';
import { AdditionalPointsComponent } from './additional-points/additional-points.component';
import { DistanceService } from '../services/distance.service';
import * as L from 'leaflet';

interface PointData {
  id: string;
  lat: number;
  lng: number;
  radius?: number;
}

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
  private additionalPoints: { id: string; marker: L.Marker }[] = [];
  pointsWithinRadiusCount: number = 0;

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

  showMainPointModal(data?: PointData) {
    const modal = this.modalService.create({
      nzTitle: data ? 'Update Main Point' : 'Add Main Point',
      nzContent: MainPointComponent,
      nzData: {
        initialData: data,
      },
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.updateMainPoint(result.latitude, result.longitude, result.radius);
      }
    });
  }

  showAdditionalPointsModal(data?: PointData) {
    const modal = this.modalService.create({
      nzTitle: data ? 'Update Additional Point' : 'Add Additional Point',
      nzContent: AdditionalPointsComponent,
      nzData: {
        initialData: data,
      },
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        if (data) {
          this.updateAdditionalPoint(
            data.id,
            result.latitude,
            result.longitude
          );
        } else {
          this.addAdditionalPoint(result.latitude, result.longitude);
        }
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
    // center the map on the main point
    this.map.setView([lat, lng], this.map.getZoom());
    this.mainPointMarker = L.marker([lat, lng], { icon: this.mainIcon }).addTo(
      this.map
    );
    this.mainPointCircle = L.circle([lat, lng], {
      radius: radius,
      color: 'green',
    }).addTo(this.map);
    this.distanceService.setMainPoint(lat, lng);
    this.bindMarkerEvents(
      this.mainPointMarker,
      { id: 'main', lat, lng, radius },
      true
    );
    this.checkAdditionalPoints();
  }

  addAdditionalPoint(lat: number, lng: number) {
    const id = `point-${Date.now()}`;
    const marker = L.marker([lat, lng], { icon: this.additionalIcon }).addTo(
      this.map
    );
    this.additionalPoints.push({ id, marker });
    this.map.setView([lat, lng], this.map.getZoom());
    this.bindMarkerEvents(marker, { id, lat, lng });
    this.checkAdditionalPoints();
  }

  updateAdditionalPoint(id: string, lat: number, lng: number) {
    const existingMarkerObj = this.additionalPoints.find(
      (point) => point.id === id
    );

    if (existingMarkerObj) {
      existingMarkerObj.marker.setLatLng([lat, lng]);
      existingMarkerObj.marker.setIcon(this.additionalIcon);
      this.bindMarkerEvents(existingMarkerObj.marker, { id, lat, lng });
    }

    this.checkAdditionalPoints();
  }

  // check if additional points are within the radius of the main point
  checkAdditionalPoints() {
    if (!this.mainPointCircle) return;
    const radius = this.mainPointCircle.getRadius();
    const center = this.mainPointCircle.getLatLng();
    let countInside = 0;

    this.additionalPoints.forEach((marker) => {
      const distance = center.distanceTo(marker.marker.getLatLng());
      if (distance <= radius) {
        marker.marker.setIcon(this.highlightedIcon);
        countInside++;
      } else {
        marker.marker.setIcon(this.additionalIcon);
      }
    });

    this.pointsWithinRadiusCount = countInside;
  }

  // display details when user clicks on main or additional points
  private bindMarkerEvents(
    marker: L.Marker,
    data: PointData,
    isMainPoint: boolean = false
  ) {
    marker.on('click', () => {
      const lat = Number(data.lat);
      const lng = Number(data.lng);
      const radius = data.radius
        ? Number(data.radius)
        : this.distanceService.calculateDistance(lat, lng);
      const content = `
      <div class="flex flex-col text-sm">
        <div>
          Latitude: ${lat.toFixed(3)}, Longitude: ${lng.toFixed(3)},
          ${
            isMainPoint
              ? `Radius: ${radius.toFixed(2)}`
              : `Distance: ${radius.toFixed(2)} m`
          }
        </div>
        <div class="text-right">
          <button
            class="edit-btn px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            Edit
          </button>
        </div>
      </div>
    `;

      const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(content)
        .openOn(this.map);

      const editButton = popup.getElement()?.querySelector('.edit-btn');
      if (editButton) {
        editButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.map.closePopup();
          if (isMainPoint) {
            this.showMainPointModal(data);
          } else {
            this.showAdditionalPointsModal(data);
          }
        });
      }
    });
  }
}
