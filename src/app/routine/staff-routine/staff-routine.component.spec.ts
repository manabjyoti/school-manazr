import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRoutineComponent } from './staff-routine.component';

describe('StaffRoutineComponent', () => {
  let component: StaffRoutineComponent;
  let fixture: ComponentFixture<StaffRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffRoutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
