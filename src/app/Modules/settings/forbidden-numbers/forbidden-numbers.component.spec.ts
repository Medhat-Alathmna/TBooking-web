import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenNumbersComponent } from './forbidden-numbers.component';

describe('ForbiddenNumbersComponent', () => {
  let component: ForbiddenNumbersComponent;
  let fixture: ComponentFixture<ForbiddenNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForbiddenNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForbiddenNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
