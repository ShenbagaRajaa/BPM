import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSiteCreationComponent } from './new-site-creation.component';

describe('NewSiteCreationComponent', () => {
  let component: NewSiteCreationComponent;
  let fixture: ComponentFixture<NewSiteCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSiteCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSiteCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
