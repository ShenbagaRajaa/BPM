import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveProblemDialogComponent } from './resolve-problem-dialog.component';

describe('ResolveProblemDialogComponent', () => {
  let component: ResolveProblemDialogComponent;
  let fixture: ComponentFixture<ResolveProblemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolveProblemDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolveProblemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
