import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanLevelComponent } from './new-plan-level.component';

describe('NewPlanLevelComponent', () => {
  let component: NewPlanLevelComponent;
  let fixture: ComponentFixture<NewPlanLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlanLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPlanLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
