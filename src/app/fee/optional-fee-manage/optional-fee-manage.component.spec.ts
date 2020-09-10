import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalFeeManageComponent } from './optional-fee-manage.component';

describe('OptionalFeeManageComponent', () => {
  let component: OptionalFeeManageComponent;
  let fixture: ComponentFixture<OptionalFeeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionalFeeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalFeeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
