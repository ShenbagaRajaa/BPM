import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlanLevelComponent } from './list-plan-level.component';

describe('ListPlanLevelComponent', () => {
  let component: ListPlanLevelComponent;
  let fixture: ComponentFixture<ListPlanLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlanLevelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPlanLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
