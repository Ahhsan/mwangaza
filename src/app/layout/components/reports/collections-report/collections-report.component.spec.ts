import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsReportComponent } from './collections-report.component';

describe('CollectionsReportComponent', () => {
  let component: CollectionsReportComponent;
  let fixture: ComponentFixture<CollectionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
