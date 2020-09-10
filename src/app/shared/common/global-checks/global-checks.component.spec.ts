import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalChecksComponent } from './global-checks.component';

describe('GlobalChecksComponent', () => {
  let component: GlobalChecksComponent;
  let fixture: ComponentFixture<GlobalChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
