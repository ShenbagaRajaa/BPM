import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSitesComponent } from './list-of-sites.component';

describe('ListOfSitesComponent', () => {
  let component: ListOfSitesComponent;
  let fixture: ComponentFixture<ListOfSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfSitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
