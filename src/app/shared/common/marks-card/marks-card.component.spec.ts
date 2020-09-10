import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksCardComponent } from './marks-card.component';

describe('MarksCardComponent', () => {
  let component: MarksCardComponent;
  let fixture: ComponentFixture<MarksCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
