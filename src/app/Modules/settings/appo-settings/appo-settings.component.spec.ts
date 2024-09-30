import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppoSettingsComponent } from './appo-settings.component';

describe('AppoSettingsComponent', () => {
  let component: AppoSettingsComponent;
  let fixture: ComponentFixture<AppoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppoSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
