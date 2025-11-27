import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubmenuDialogComponent } from './admin-submenu-dialog.component';

describe('AdminSubmenuDialogComponent', () => {
  let component: AdminSubmenuDialogComponent;
  let fixture: ComponentFixture<AdminSubmenuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubmenuDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSubmenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
