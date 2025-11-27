import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoleCreationComponent } from './new-role-creation.component';

describe('NewRoleCreationComponent', () => {
  let component: NewRoleCreationComponent;
  let fixture: ComponentFixture<NewRoleCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRoleCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRoleCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
