import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MainPointComponent } from './main-point/main-point.component';
import { AdditionalPointsComponent } from './additional-points/additional-points.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'MapApplication';
  constructor(private modalService: NzModalService) {}

  showMainPointModal() {
    const modal = this.modalService.create({
      nzTitle: 'Manage Main Point',
      nzContent: MainPointComponent,
      nzFooter: null,
    });
  }

  showAdditionalPointsModal() {
    const modal = this.modalService.create({
      nzTitle: 'Add Additional Points',
      nzContent: AdditionalPointsComponent,
      nzFooter: null,
    });
  }
}
