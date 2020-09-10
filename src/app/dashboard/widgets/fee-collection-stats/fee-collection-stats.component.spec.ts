import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollectionStatsComponent } from './fee-collection-stats.component';

describe('FeeCollectionStatsComponent', () => {
  let component: FeeCollectionStatsComponent;
  let fixture: ComponentFixture<FeeCollectionStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCollectionStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCollectionStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
