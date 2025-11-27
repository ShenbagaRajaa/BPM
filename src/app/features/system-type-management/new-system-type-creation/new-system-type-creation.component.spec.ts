import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSystemTypeCreationComponent } from './new-system-type-creation.component';

describe('NewSystemTypeCreationComponent', () => {
  let component: NewSystemTypeCreationComponent;
  let fixture: ComponentFixture<NewSystemTypeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSystemTypeCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSystemTypeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
