import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanTypeCreationComponent } from './new-plan-type-creation.component';

describe('NewPlanTypeCreationComponent', () => {
  let component: NewPlanTypeCreationComponent;
  let fixture: ComponentFixture<NewPlanTypeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlanTypeCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPlanTypeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
