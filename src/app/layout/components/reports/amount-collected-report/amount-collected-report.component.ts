import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatDatepicker } from '@angular/material/datepicker';
import { AmountCollectedReportService } from 'app/services/reportServices/amount-collected-report/amount-collected-report.service';
import PNotify from 'pnotify/dist/es/PNotify';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
  selector: 'app-amount-collected-report',
  templateUrl: './amount-collected-report.component.html',
  styleUrls: ['./amount-collected-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AmountCollectedReportComponent implements OnInit {
  dataArrived = false;
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['invoiceDate', 'invoiceNumber', 'organizationName', 'customerName', 'salesPersonName', 'authorizingOfficerName', 'productName', 'loanTerm', 'quantity', 'price', 'amount', 'amountExpected', 'amountCollected'];
  footerColumns: string[] = ['amount', 'dueAmount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  fromDate;
  tillDate;
  searchUsing;
  searchFor;
  pageIndex = 1;
  pageNumber;
  paginationInformation;
  paginatorLength;
  ageing = 0;
  defaultingDate = moment();
  START_DATE = new FormControl(moment());
  monthAndYear = new FormControl(moment());
  constructor(
    private router: Router,
    private amountCollectedReportService: AmountCollectedReportService
  ) { }
  private reports: any;


  ngOnInit(): void {
    if (moment().date() > 10) {
      this.calculateAging();
    }

    this.paginator.pageSize = 25;
    this.amountCollectedReportService.getDailyReport().subscribe((response) => {
      console.log('Response of amount collected: ', response);

      this.reports = response.body;
      this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
      console.log('PaginationInformation: ', this.paginationInformation);

      this.paginator.length = this.paginationInformation.TotalCount;
      this.paginatorLength = this.paginationInformation.TotalCount;
      this.paginator.pageIndex = 0;

      this.dataSource = new MatTableDataSource(this.reports);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => console.log('Error occured while fetching amount collected report: ', error));

  }
  onPageChange(event) {
    console.log('Paginator event: ', event);


    // Check if the event of first page is triggered
    if (event.pageIndex === 0) {
      console.log('FIRST PAGE BUTTON CALLED')
      this.amountCollectedReportService.getFirstPage().subscribe((response) => {
        console.log('Response of sales report : ', response);
        this.reports = response.body;
        this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
        console.log('PaginationInformation: ', this.paginationInformation);

        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        this.paginator.pageIndex = 0;

        // console.log('paginator properties: ', this.paginator);
        this.dataSource = new MatTableDataSource(this.reports);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, (error) => {
        console.log('Error occured while fetching sales report: ', error);
      });
      return;
    }
    // Check if the event of last page is triggered
    if (event.pageIndex + 1 === this.paginationInformation.TotalPages) {
      console.log('LAST PAGE BUTTON CALLED')
      this.amountCollectedReportService.getLastPage(this.paginationInformation.TotalPages).subscribe((response) => {
        console.log('Response of sales report : ', response);
        this.reports = response.body;
        this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
        console.log('PaginationInformation: ', this.paginationInformation);

        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        // this.paginator.pageIndex = 0;

        // console.log('paginator properties: ', this.paginator);
        this.dataSource = new MatTableDataSource(this.reports);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, (error) => {
        console.log('Error occured while fetching sales report: ', error);
      });
      return;
    }
    // Checks if the event of next button is triggered
    if (event.pageIndex === this.paginationInformation.CurrentPage) {
      console.log('NEXT BUTTON CLICKED');
      this.amountCollectedReportService.getNextPage(this.paginationInformation.CurrentPage).subscribe(response => {
        this.reports = response.body;
        this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
        this.pageIndex = this.paginationInformation.CurrentPage;

        this.dataSource = new MatTableDataSource(this.reports);
        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        // this.dataSource.paginator = this.paginator;

        console.log('NextFunction PaginationInformation: ', this.paginationInformation);
        console.log('NextFunctionFunction AngularPaginator information: ', this.paginator);
      });
      return;
    }
    // Checks if the event of previous button is triggered
    if (event.pageIndex === this.paginationInformation.CurrentPage - 2) {
      console.log('PREVIOUS BUTTON CLICKED');
      this.amountCollectedReportService.getPreviousPage(this.paginationInformation.CurrentPage).subscribe(response => {
        this.reports = response.body;
        this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
        this.pageIndex = this.paginationInformation.CurrentPage;

        this.dataSource = new MatTableDataSource(this.reports);
        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        // this.dataSource.paginator = this.paginator;

        console.log('PreviousFunction PaginationInformation: ', this.paginationInformation);
        console.log('PreviousFunctionFunction AngularPaginator information: ', this.paginator);
      });
      return;
    }


  }
  calculateAging() {

    this.ageing = Math.abs(moment().diff(this.monthAndYear.value.date(10), 'days'));

  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getTotalAmount(): void {
    if (this.reports) {
      return this.reports.map(r => r.amount).reduce((acc, value) => acc + value, 0);
    }

  }
  getTotalAmountExpected() {
    if (this.reports) {
      return this.reports.map(r => r.amountExpected).reduce((acc, value) => acc + value, 0);
    }

  }
  getTotalAmountCollected() {
    if (this.reports) {
      return this.reports.map(r => r.amountCollected).reduce((acc, value) => acc + value, 0);
    }

  }
  endDatechosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    // console.log(this.END_DATE.value);
    let ctrlValue = this.monthAndYear.value;
    // console.log('CTRL value: ', ctrlValue);
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

  searchForRecords(): void {
    if (!this.monthAndYear.value) {
      PNotify.error({
        title: 'Please select a valid date range',
        minHeight: '75px'
      });
      return;
    }
    this.calculateAging()
    // getting the number of days in selected month
    const daysInMonth = this.monthAndYear.value.daysInMonth();
    const selectedMonthAndYear = this.monthAndYear.value.date(daysInMonth).hour(23).minute(59).second(59);

    console.log('Number of days in selected month:  ', daysInMonth);
    console.log('EndDate: ', selectedMonthAndYear.format());

    this.amountCollectedReportService.getFilteredReport(selectedMonthAndYear, this.searchUsing, this.searchFor)
      .subscribe((resp: any) => {
        this.reports = resp.body;

        this.dataSource = new MatTableDataSource(this.reports);
        this.paginationInformation = JSON.parse(resp.headers.get('X-Pagination'));
        console.log('PaginationInformation: ', this.paginationInformation);
        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        this.dataSource.sort = this.sort;
        if (resp.body.length === 0) {
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
