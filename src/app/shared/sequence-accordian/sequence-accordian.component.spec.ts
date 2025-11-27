import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceAccordianComponent } from './sequence-accordian.component';

describe('SequenceAccordianComponent', () => {
  let component: SequenceAccordianComponent;
  let fixture: ComponentFixture<SequenceAccordianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceAccordianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SequenceAccordianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
