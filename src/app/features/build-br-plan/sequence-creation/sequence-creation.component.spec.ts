import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceCreationComponent } from './sequence-creation.component';

describe('SequenceCreationComponent', () => {
  let component: SequenceCreationComponent;
  let fixture: ComponentFixture<SequenceCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequenceCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SequenceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
