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

  constructor(private modalRef: NzModalRef) {}

  ngOnInit() {
    const initialData = this.modalRef.getConfig().nzData?.initialData;
    if (initialData) {
      this.mainPointForm.setValue({
        latitude: initialData.lat,
        longitude: initialData.lng,
        radius: initialData.radius || 0,
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
