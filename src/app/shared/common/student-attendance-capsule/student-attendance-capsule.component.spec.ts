import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceCapsuleComponent } from './student-attendance-capsule.component';

describe('StudentAttendanceCapsuleComponent', () => {
  let component: StudentAttendanceCapsuleComponent;
  let fixture: ComponentFixture<StudentAttendanceCapsuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAttendanceCapsuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttendanceCapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
