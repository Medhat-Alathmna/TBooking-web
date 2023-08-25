import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayByComponent } from './pay-by.component';

describe('PayByComponent', () => {
  let component: PayByComponent;
  let fixture: ComponentFixture<PayByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
