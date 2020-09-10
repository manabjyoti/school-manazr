import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGradeComponent } from './view-grade.component';

describe('ViewGradeComponent', () => {
  let component: ViewGradeComponent;
  let fixture: ComponentFixture<ViewGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
