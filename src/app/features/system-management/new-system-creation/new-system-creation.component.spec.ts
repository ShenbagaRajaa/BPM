import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSystemCreationComponent } from './new-system-creation.component';

describe('NewSystemCreationComponent', () => {
  let component: NewSystemCreationComponent;
  let fixture: ComponentFixture<NewSystemCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSystemCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSystemCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
