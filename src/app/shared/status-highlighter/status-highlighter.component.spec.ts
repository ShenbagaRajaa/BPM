import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHighlighterComponent } from './status-highlighter.component';

describe('StatusHighlighterComponent', () => {
  let component: StatusHighlighterComponent;
  let fixture: ComponentFixture<StatusHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusHighlighterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
