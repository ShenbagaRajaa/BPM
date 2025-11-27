import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDrteamsComponent } from './list-of-drteams.component';

describe('ListOfDrteamsComponent', () => {
  let component: ListOfDrteamsComponent;
  let fixture: ComponentFixture<ListOfDrteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfDrteamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfDrteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
