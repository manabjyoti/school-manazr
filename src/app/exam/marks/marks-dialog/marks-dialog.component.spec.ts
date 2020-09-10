import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksDialogComponent } from './marks-dialog.component';

describe('MarksDialogComponent', () => {
  let component: MarksDialogComponent;
  let fixture: ComponentFixture<MarksDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
