import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCountComponent } from './staff-count.component';

describe('StaffCountComponent', () => {
  let component: StaffCountComponent;
  let fixture: ComponentFixture<StaffCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
