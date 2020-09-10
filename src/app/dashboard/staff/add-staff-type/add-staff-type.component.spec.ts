import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffTypeComponent } from './add-staff-type.component';

describe('AddStaffTypeComponent', () => {
  let component: AddStaffTypeComponent;
  let fixture: ComponentFixture<AddStaffTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStaffTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStaffTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
