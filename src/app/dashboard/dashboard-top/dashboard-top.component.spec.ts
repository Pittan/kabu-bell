import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopComponent } from './dashboard-top.component';

describe('DashboardTopComponent', () => {
  let component: DashboardTopComponent;
  let fixture: ComponentFixture<DashboardTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
