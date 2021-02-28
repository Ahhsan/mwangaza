import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountCollectedReportComponent } from './amount-collected-report.component';

describe('AmountCollectedReportComponent', () => {
  let component: AmountCollectedReportComponent;
  let fixture: ComponentFixture<AmountCollectedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountCollectedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountCollectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
