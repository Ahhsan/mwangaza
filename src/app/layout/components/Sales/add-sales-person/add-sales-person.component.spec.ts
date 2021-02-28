import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesPersonComponent } from './add-sales-person.component';

describe('AddSalesPersonComponent', () => {
  let component: AddSalesPersonComponent;
  let fixture: ComponentFixture<AddSalesPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
