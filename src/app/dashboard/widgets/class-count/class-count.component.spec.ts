import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCountComponent } from './class-count.component';

describe('ClassCountComponent', () => {
  let component: ClassCountComponent;
  let fixture: ComponentFixture<ClassCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
