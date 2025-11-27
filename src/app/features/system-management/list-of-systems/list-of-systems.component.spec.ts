import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSystemsComponent } from './list-of-systems.component';

describe('ListOfSystemsComponent', () => {
  let component: ListOfSystemsComponent;
  let fixture: ComponentFixture<ListOfSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfSystemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
