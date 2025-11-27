import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBRPlanComponent } from './test-br-plan.component';

describe('TestBRPlanComponent', () => {
  let component: TestBRPlanComponent;
  let fixture: ComponentFixture<TestBRPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBRPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestBRPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
