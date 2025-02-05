import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DistanceService } from '../distance.service';

@Component({
  selector: 'app-additional-points',
  templateUrl: './additional-points.component.html',
  styleUrls: ['./additional-points.component.scss'],
})
export class AdditionalPointsComponent {
  additionalPointsForm = new FormGroup({
    latitude: new FormControl('', Validators.required),
    longitude: new FormControl('', Validators.required),
    radius: new FormControl({ value: '', disabled: true }),
  });

  constructor(private modalRef: NzModalRef, private distanceService: DistanceService) {
    this.setupFormChanges();
  }

  setupFormChanges() {
    const latControl = this.additionalPointsForm.get('latitude');
    const lngControl = this.additionalPointsForm.get('longitude');
    
    if (latControl && lngControl) {
      latControl.valueChanges.subscribe(() => this.updateRadius());
      lngControl.valueChanges.subscribe(() => this.updateRadius());
    }
  }

  updateRadius() {
    const lat = this.additionalPointsForm.get('latitude')?.value;
    const lng = this.additionalPointsForm.get('longitude')?.value;
    if (lat && lng) {
      const distance = this.distanceService.calculateDistance(Number(lat), Number(lng));
      this.additionalPointsForm.get('radius')?.setValue(distance.toFixed(2));
    }
  }
  
  onSubmitAdditionalPoints() {
    if (this.additionalPointsForm.valid) {
      this.modalRef.close(this.additionalPointsForm.value);
      this.additionalPointsForm.reset();
    }
  }
}
