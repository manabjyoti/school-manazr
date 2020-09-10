import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentButtonsComponent } from './payment-buttons.component';

describe('PaymentButtonsComponent', () => {
  let component: PaymentButtonsComponent;
  let fixture: ComponentFixture<PaymentButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
