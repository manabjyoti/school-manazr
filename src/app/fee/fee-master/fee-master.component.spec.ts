import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeMasterComponent } from './fee-master.component';

describe('FeeMasterComponent', () => {
  let component: FeeMasterComponent;
  let fixture: ComponentFixture<FeeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
