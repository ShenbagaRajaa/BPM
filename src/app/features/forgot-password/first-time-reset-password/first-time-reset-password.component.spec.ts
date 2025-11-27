import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeResetPasswordComponent } from './first-time-reset-password.component';

describe('FirstTimeResetPasswordComponent', () => {
  let component: FirstTimeResetPasswordComponent;
  let fixture: ComponentFixture<FirstTimeResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimeResetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirstTimeResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
