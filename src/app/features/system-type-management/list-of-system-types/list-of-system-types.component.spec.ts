import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSystemTypesComponent } from './list-of-system-types.component';

describe('ListOfSystemTypesComponent', () => {
  let component: ListOfSystemTypesComponent;
  let fixture: ComponentFixture<ListOfSystemTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfSystemTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfSystemTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
