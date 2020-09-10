import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentExcelComponent } from './add-student-excel.component';

describe('AddStudentExcelComponent', () => {
  let component: AddStudentExcelComponent;
  let fixture: ComponentFixture<AddStudentExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
