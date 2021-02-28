import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { CollectionReportService } from 'app/services/reportServices/collection-report/collection-report.service';
import { tap } from 'rxjs/operators';
import PNotify from 'pnotify/dist/es/PNotify';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-collections-report',
  templateUrl: './collections-report.component.html',
  styleUrls: ['./collections-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CollectionsReportComponent implements OnInit {
  dataArrived = false;
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['invoiceDate', 'invoiceNumber', 'organizationName', 'customerName', 'salesPersonName', 'authorizingOfficerName', 'productName', 'loanTerm', 'quantity', 'price', 'amount', 'amountDue'];
  footerColumns: string[] = ['amount', 'amountDue'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: any;
  fromDate;
  tillDate;
  searchUsing;
  searchFor;

  START_DATE = new FormControl(moment());
  monthAndYear = new FormControl(moment());

  ageing = 0;
  defaultingDate = moment();
  organizationFilter;
  customerFilter;
  salesPersonFilter;
  authorizingOfficerFilter;
  itemFilter;
  selectedFilter;
  constructor(
    private router: Router,
    private collectionReportService: CollectionReportService
  ) { }

  reports: any;


  ngOnInit(): void {

    if (moment().date() > 10) {
      this.calculateAging();
    }
    this.paginator.pageSize = 25;
    this.collectionReportService.getDailyReport().subscribe((response) => {
      console.log('Response of collectionReport: ', response);
      this.reports = response.body;
      console.log(response.headers.get('X-Pagination'))
      this.dataSource = new MatTableDataSource(this.reports);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }
      , error => console.log('Error occured while fetching report: ', error));
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTotalAmount(): number {
    if (this.reports) {
      return this.reports.map(r => r.amount).reduce((acc, value) => acc + value, 0);
    }
  }
  getTotalAmountDue(): number {
    if (this.reports) {
      return this.reports.map(r => r.amountDue).reduce((acc, value) => acc + value, 0);
    }
  }
  endDatechosenYearHandler(normalizedYear: Moment) {
    // console.log(this.END_DATE.value);
    let ctrlValue = this.monthAndYear.value;
    if (!ctrlValue) {
      ctrlValue = moment();
    }
    ctrlValue.year(normalizedYear.year());
    this.monthAndYear.setValue(ctrlValue);
  }

  endDatechosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {

    const ctrlValue = this.monthAndYear.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthAndYear.setValue(ctrlValue);
    console.log('EndDate: ', this.monthAndYear.value.format());
    datepicker.close();
  }



  // startDatechosenYearHandler(normalizedYear: Moment) {
  //   // console.log(this.START_DATE.value);
  //   const ctrlValue = this.START_DATE.value;
  //   ctrlValue.year(normalizedYear.year());

  //   this.START_DATE.setValue(ctrlValue);
  // }

  // startDatechosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {

  //   const ctrlValue = this.START_DATE.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.START_DATE.setValue(ctrlValue);
  //   console.log('StartDate: ', this.START_DATE.value.format());
  //   datepicker.close();
  // }


  calculateAging() {

    this.ageing = Math.abs(moment().diff(this.monthAndYear.value.date(10), 'days'));

  }
  searchForRecords(): void {

    // getting the number of days in selected month
    const daysInMonth = this.monthAndYear.value.daysInMonth();

    if (!this.monthAndYear.value) {
      PNotify.error({
        title: 'Please select a valid date range',
        minHeight: '75px'
      });
      return;
    }

    this.calculateAging();
    const eDate = this.monthAndYear.value.date(daysInMonth).hour(23).minute(59).second(59);
    console.log(eDate.month());
    // console.log('StartDate: ', sDate.format());
    console.log('EndDate: ', eDate.format());
    console.log('Search for: ', this.searchFor);
    console.log('Search using: ', this.searchUsing);

    this.collectionReportService.getFilteredReport(eDate, this.searchUsing, this.searchFor)
      .subscribe((resp: any) => {
        console.log('Response of filteredReports: ', resp)
        this.reports = resp;
        this.dataSource = new MatTableDataSource(this.reports);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (resp.length === 0) {
          PNotify.error({
            title: 'There are no records in selected month ',
            minHeight: '75px'
          });
          this.ageing = 0;
          return;
        }
        PNotify.success({
          title: 'Report fetched successfully',
          minHeight: '75px',
        });
      }, (error) => {
        console.log('An error occured while fetching reports: ', error)
        PNotify.error({
          title: 'An error occured while fetching report',
          minHeight: '75px'
        });
      });
  }

}


