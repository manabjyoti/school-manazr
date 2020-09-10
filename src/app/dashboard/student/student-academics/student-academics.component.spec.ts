import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAcademicsComponent } from './student-academics.component';

describe('StudentAcademicsComponent', () => {
  let component: StudentAcademicsComponent;
  let fixture: ComponentFixture<StudentAcademicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAcademicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAcademicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
