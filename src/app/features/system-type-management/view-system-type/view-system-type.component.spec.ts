import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSystemTypeComponent } from './view-system-type.component';

describe('ViewSystemTypeComponent', () => {
  let component: ViewSystemTypeComponent;
  let fixture: ComponentFixture<ViewSystemTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSystemTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSystemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
