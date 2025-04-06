import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalPointsComponent } from './additional-points.component';

describe('AdditionalPointsComponent', () => {
  let component: AdditionalPointsComponent;
  let fixture: ComponentFixture<AdditionalPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalPointsComponent]
    });
    fixture = TestBed.createComponent(AdditionalPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
