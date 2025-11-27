import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPermissionToRoleComponent } from './assign-permission-to-role.component';

describe('AssignPermissionToRoleComponent', () => {
  let component: AssignPermissionToRoleComponent;
  let fixture: ComponentFixture<AssignPermissionToRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPermissionToRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignPermissionToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
