import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-main-point',
  templateUrl: './main-point.component.html',
  styleUrls: ['./main-point.component.scss'],
})
export class MainPointComponent implements OnInit {
  mainPointForm: FormGroup = new FormGroup({
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    radius: new FormControl('', [Validators.required]),
  });
  initialData: any;

  constructor(private modalRef: NzModalRef) {}

  ngOnInit() {
   this.initialData = this.modalRef.getConfig().nzData?.initialData;
    if (this.initialData) {
      this.mainPointForm.setValue({
        latitude: this.initialData.lat,
        longitude: this.initialData.lng,
        radius: this.initialData.radius || 0,
      });
    }
  }

  onSubmitMainPoint() {
    if (this.mainPointForm.valid) {
      this.modalRef.close(this.mainPointForm.value);
      this.mainPointForm.reset();
    } else {
      Object.values(this.mainPointForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
