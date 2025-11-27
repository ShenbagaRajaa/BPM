import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubmenuMobileDialogComponent } from './admin-submenu-mobile-dialog.component';

describe('AdminSubmenuMobileDialogComponent', () => {
  let component: AdminSubmenuMobileDialogComponent;
  let fixture: ComponentFixture<AdminSubmenuMobileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubmenuMobileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSubmenuMobileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
