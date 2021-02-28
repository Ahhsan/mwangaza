import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsReportComponent } from './debtors-report.component';

describe('DebtorsReportComponent', () => {
  let component: DebtorsReportComponent;
  let fixture: ComponentFixture<DebtorsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtorsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtorsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
