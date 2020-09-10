import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCountComponent } from './subject-count.component';

describe('SubjectCountComponent', () => {
  let component: SubjectCountComponent;
  let fixture: ComponentFixture<SubjectCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
