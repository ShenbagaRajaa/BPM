import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationAccordionComponent } from './task-creation-accordion.component';

describe('TaskCreationAccordionComponent', () => {
  let component: TaskCreationAccordionComponent;
  let fixture: ComponentFixture<TaskCreationAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreationAccordionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskCreationAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
