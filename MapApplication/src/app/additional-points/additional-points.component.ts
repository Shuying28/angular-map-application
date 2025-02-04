import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-additional-points',
  templateUrl: './additional-points.component.html',
  styleUrls: ['./additional-points.component.scss'],
})
export class AdditionalPointsComponent implements OnInit {
  additionalPointsForm = new FormGroup({
    latitude: new FormControl('', Validators.required),
    longitude: new FormControl('', Validators.required),
    radius: new FormControl({ value: '', disabled: true }),
  });
  @Input() mainPoint!: L.LatLng;
  private map!: L.Map;
  private redIcon = L.icon({
    iconUrl:
      'data:image/svg+xml;base64,' +
      btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#FF0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    `),
    iconSize: [24, 24], // size of the icon
    iconAnchor: [12, 24], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -24], // point from which the popup should open relative to the iconAnchor
  });

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('additional-map').setView(
      this.mainPoint || [51.505, -0.09],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.map);
  }

  onSubmitAdditionalPoints() {
    const { latitude, longitude } = this.additionalPointsForm.value;
    const latLng = L.latLng(Number(latitude), Number(longitude));
    const distance = this.mainPoint.distanceTo(latLng); // Calculate distance
    const radiusControl = this.additionalPointsForm.get('radius');
    if (radiusControl) {
      radiusControl.setValue(distance.toFixed(2));
    }

    L.marker(latLng, {
      icon: this.redIcon,
    }).addTo(this.map); // Add marker
  }
}
