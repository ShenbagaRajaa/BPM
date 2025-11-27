import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkillCreationComponent } from './new-skill-creation.component';

describe('NewSkillCreationComponent', () => {
  let component: NewSkillCreationComponent;
  let fixture: ComponentFixture<NewSkillCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSkillCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSkillCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
