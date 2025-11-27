import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrteamCreationComponent } from './new-drteam-creation.component';

describe('NewDrteamCreationComponent', () => {
  let component: NewDrteamCreationComponent;
  let fixture: ComponentFixture<NewDrteamCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDrteamCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDrteamCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
