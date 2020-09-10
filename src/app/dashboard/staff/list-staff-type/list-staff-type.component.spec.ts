import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStaffTypeComponent } from './list-staff-type.component';

describe('ListStaffTypeComponent', () => {
  let component: ListStaffTypeComponent;
  let fixture: ComponentFixture<ListStaffTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStaffTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStaffTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
