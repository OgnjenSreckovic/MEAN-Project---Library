import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentPeriodSetterComponent } from './rent-period-setter.component';

describe('RentPeriodSetterComponent', () => {
  let component: RentPeriodSetterComponent;
  let fixture: ComponentFixture<RentPeriodSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentPeriodSetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentPeriodSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
