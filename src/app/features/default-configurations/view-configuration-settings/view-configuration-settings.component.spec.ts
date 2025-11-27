import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConfigurationSettingsComponent } from './view-configuration-settings.component';

describe('ViewConfigurationSettingsComponent', () => {
  let component: ViewConfigurationSettingsComponent;
  let fixture: ComponentFixture<ViewConfigurationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConfigurationSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewConfigurationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
