import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DistanceService } from '../distance.service';

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

  @Input() initialData: any;

  constructor(
    private modalRef: NzModalRef,
    private distanceService: DistanceService
  ) {}

  ngOnInit() {
    const initialData = this.modalRef.getConfig().nzData?.initialData;
    if (initialData) {
      this.additionalPointsForm.patchValue({
        latitude: initialData.lat,
        longitude: initialData.lng,
      });
      this.updateRadius();
    }
    this.setupFormChanges();
  }

  setupFormChanges() {
    const latControl = this.additionalPointsForm.get('latitude');
    const lngControl = this.additionalPointsForm.get('longitude');

    latControl?.valueChanges.subscribe(() => this.updateRadius());
    lngControl?.valueChanges.subscribe(() => this.updateRadius());
  }

  updateRadius() {
    const lat = this.additionalPointsForm.get('latitude')?.value;
    const lng = this.additionalPointsForm.get('longitude')?.value;
    if (lat && lng) {
      const distance = this.distanceService.calculateDistance(
        Number(lat),
        Number(lng)
      );
      this.additionalPointsForm.get('radius')?.setValue(distance.toFixed(2));
    }
  }

  onSubmitAdditionalPoints() {
    if (this.additionalPointsForm.valid) {
      this.additionalPointsForm.get('radius')?.enable();
      this.modalRef.close(this.additionalPointsForm.value);
      this.additionalPointsForm.reset();
    } else {
      Object.values(this.additionalPointsForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
