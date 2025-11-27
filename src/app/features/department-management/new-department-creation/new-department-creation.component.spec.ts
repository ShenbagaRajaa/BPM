import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDepartmentCreationComponent } from './new-department-creation.component';

describe('NewDepartmentCreationComponent', () => {
  let component: NewDepartmentCreationComponent;
  let fixture: ComponentFixture<NewDepartmentCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDepartmentCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDepartmentCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
