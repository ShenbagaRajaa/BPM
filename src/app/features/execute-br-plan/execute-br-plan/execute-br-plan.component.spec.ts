import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteBRPlanComponent } from './execute-br-plan.component';

describe('ExecuteBRPlanComponent', () => {
  let component: ExecuteBRPlanComponent;
  let fixture: ComponentFixture<ExecuteBRPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecuteBRPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecuteBRPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
