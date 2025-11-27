import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfigurationSettingsComponent } from './add-configuration-settings.component';

describe('AddConfigurationSettingsComponent', () => {
  let component: AddConfigurationSettingsComponent;
  let fixture: ComponentFixture<AddConfigurationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConfigurationSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddConfigurationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
