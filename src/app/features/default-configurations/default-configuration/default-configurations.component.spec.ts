import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultConfigurationComponent } from './default-configurations.component';

describe('DefaultConfigurationsComponent', () => {
  let component: DefaultConfigurationComponent;
  let fixture: ComponentFixture<DefaultConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultConfigurationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
