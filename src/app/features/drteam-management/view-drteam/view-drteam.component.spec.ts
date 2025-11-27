import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDrteamComponent } from './view-drteam.component';

describe('ViewDrteamComponent', () => {
  let component: ViewDrteamComponent;
  let fixture: ComponentFixture<ViewDrteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDrteamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDrteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
