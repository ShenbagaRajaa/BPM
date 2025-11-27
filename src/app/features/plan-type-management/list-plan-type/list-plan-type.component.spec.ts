import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlanTypeComponent } from './list-plan-type.component';

describe('ListPlanTypeComponent', () => {
  let component: ListPlanTypeComponent;
  let fixture: ComponentFixture<ListPlanTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlanTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPlanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
