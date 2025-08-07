import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotifictionComponent } from './push-notifiction.component';

describe('PushNotifictionComponent', () => {
  let component: PushNotifictionComponent;
  let fixture: ComponentFixture<PushNotifictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushNotifictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushNotifictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
