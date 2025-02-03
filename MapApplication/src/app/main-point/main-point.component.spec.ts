import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPointComponent } from './main-point.component';

describe('MainPointComponent', () => {
  let component: MainPointComponent;
  let fixture: ComponentFixture<MainPointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPointComponent]
    });
    fixture = TestBed.createComponent(MainPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
