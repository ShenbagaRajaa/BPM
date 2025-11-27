import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDepartmentsComponent } from './list-of-departments.component';

describe('ListOfDepartmentsComponent', () => {
  let component: ListOfDepartmentsComponent;
  let fixture: ComponentFixture<ListOfDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfDepartmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
