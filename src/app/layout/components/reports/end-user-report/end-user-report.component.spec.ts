import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserReportComponent } from './end-user-report.component';

describe('EndUserReportComponent', () => {
  let component: EndUserReportComponent;
  let fixture: ComponentFixture<EndUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
