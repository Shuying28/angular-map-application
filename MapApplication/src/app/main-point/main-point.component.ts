import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-main-point',
  templateUrl: './main-point.component.html',
  styleUrls: ['./main-point.component.scss'],
})
export class MainPointComponent implements OnInit {
  mainPointForm = new FormGroup({
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    radius: new FormControl(''),
  });
  private map!: L.Map;
  private mainPointMarker!: L.Marker;
  private circle!: L.Circle;

  ngOnInit() {
    console.log('MainPointComponent initialized');
    this.initMap();
  }

  ngAfterViewInit() {
    console.log('MainPointComponent view initialized');
    this.initMap();
  }

  initMap() {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(this.map);
  }

  onSubmitMainPoint() {
    const { latitude, longitude, radius } = this.mainPointForm.value;
    const latLng = L.latLng(Number(latitude), Number(longitude));
    if (this.mainPointMarker) this.mainPointMarker.remove();
    this.mainPointMarker = L.marker(latLng, {
      icon: L.icon({ iconUrl: 'path_to_blue_icon' }),
    }).addTo(this.map);
    if (this.circle) this.circle.remove();
    this.circle = L.circle(latLng, {
      radius: Number(radius),
      color: 'green',
    }).addTo(this.map);
  }
}
