import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildBrPlanComponent } from './build-br-plan.component';

describe('BuildBrPlanComponent', () => {
  let component: BuildBrPlanComponent;
  let fixture: ComponentFixture<BuildBrPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildBrPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuildBrPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
