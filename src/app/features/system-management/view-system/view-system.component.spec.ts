import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSystemComponent } from './view-system.component';

describe('ViewSystemComponent', () => {
  let component: ViewSystemComponent;
  let fixture: ComponentFixture<ViewSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
