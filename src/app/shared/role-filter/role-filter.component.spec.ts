import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFilterComponent } from './role-filter.component';

describe('RoleFilterComponent', () => {
  let component: RoleFilterComponent;
  let fixture: ComponentFixture<RoleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
