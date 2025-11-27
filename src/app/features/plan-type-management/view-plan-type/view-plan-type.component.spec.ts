import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanTypeComponent } from './view-plan-type.component';

describe('ViewPlanTypeComponent', () => {
  let component: ViewPlanTypeComponent;
  let fixture: ComponentFixture<ViewPlanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlanTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPlanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
