import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanLevelComponent } from './view-plan-level.component';

describe('ViewPlanLevelComponent', () => {
  let component: ViewPlanLevelComponent;
  let fixture: ComponentFixture<ViewPlanLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlanLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPlanLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
