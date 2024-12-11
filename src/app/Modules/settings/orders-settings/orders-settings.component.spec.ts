import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSettingsComponent } from './orders-settings.component';

describe('OrdersSettingsComponent', () => {
  let component: OrdersSettingsComponent;
  let fixture: ComponentFixture<OrdersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
