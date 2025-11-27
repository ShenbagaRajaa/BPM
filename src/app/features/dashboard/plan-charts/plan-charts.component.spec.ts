import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChartsComponent } from './plan-charts.component';

describe('PlanChartsComponent', () => {
  let component: PlanChartsComponent;
  let fixture: ComponentFixture<PlanChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
