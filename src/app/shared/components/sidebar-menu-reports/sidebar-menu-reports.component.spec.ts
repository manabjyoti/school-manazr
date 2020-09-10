import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuReportsComponent } from './sidebar-menu-reports.component';

describe('SidebarMenuReportsComponent', () => {
  let component: SidebarMenuReportsComponent;
  let fixture: ComponentFixture<SidebarMenuReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarMenuReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMenuReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
