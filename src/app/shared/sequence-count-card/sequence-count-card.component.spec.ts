import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceCountCardComponent } from './sequence-count-card.component';

describe('SequenceCountCardComponent', () => {
  let component: SequenceCountCardComponent;
  let fixture: ComponentFixture<SequenceCountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceCountCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SequenceCountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
