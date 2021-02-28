import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import PNotify from 'pnotify/dist/es/PNotify';
import { SalesReportService } from 'app/services/reportServices/sales-report/sales-report.service';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {
  dataArrived = false;
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['invoiceDate', 'invoiceNumber', 'organizationName', 'customerName', 'salesPersonName', 'authorizingOfficerName', 'productName', 'loanTerm', 'quantity', 'price', 'amount'];
  footerColumns: string[] = ['amount', 'dueAmount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  paginatorLength;
  fromDate = moment().date(1).hour(12).minute(0).second(0);
  tillDate = moment().hour(23).minute(59).second(59);
  searchUsing;
  searchFor;
  pageIndex = 1;
  pageNumber;
  paginationInformation;
  constructor(private salesReportService: SalesReportService) { }
  private reports: any;

  ngOnInit(): void {
    this.paginator.pageSize = 25;
    this.paginator.pageIndex = this.pageIndex;
    this.salesReportService.getDailyReport().subscribe((response) => {
      console.log('Response of sales report : ', response);
      this.reports = response.body;
      this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
      console.log('PaginationInformation: ', this.paginationInformation);

      this.paginator.length = this.paginationInformation.TotalCount;
      this.paginatorLength = this.paginationInformation.TotalCount;
      this.paginator.pageIndex = 0;

      // console.log('paginator properties: ', this.paginator);
      this.dataSource = new MatTableDataSource(this.reports);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error) => {
      console.log('Error occured while fetching sales report: ', error);
    });
  }

  onPageChange(event) {
    console.log('Paginator event: ', event);


    // Check if the event of first page is triggered
    if (event.pageIndex === 0) {
      console.log('FIRST PAGE BUTTON CALLED')
      this.salesReportService.getFirstPage().subscribe((response) => {
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
      this.salesReportService.getLastPage(this.paginationInformation.TotalPages).subscribe((response) => {
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
      this.salesReportService.getNextPage(this.paginationInformation.CurrentPage).subscribe(response => {
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
      this.salesReportService.getPreviousPage(this.paginationInformation.CurrentPage).subscribe(response => {
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
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getTotalAmount() {
    if (this.reports) {
      return this.reports.map(r => r.amount).reduce((acc, value) => acc + value, 0);
    }
  }


  searchForRecords(): void {
    if (!this.fromDate || !this.tillDate) {
      PNotify.error({
        title: 'Please select a valid date range',
        minHeight: '75px'
      });
      return;
    }
    const sDate = this.fromDate.hour(12).minute(0).second(0);
    const eDate = this.tillDate.hour(23).minute(59).second(59);
    console.log('StartDate: ', sDate.format());
    console.log('EndDate: ', eDate.format());

    this.salesReportService.getFilteredReport(sDate.format(), eDate.format(), this.searchUsing, this.searchFor)
      .subscribe((response: any) => {
        this.reports = response.body;

        this.dataSource = new MatTableDataSource(this.reports);
        // this.dataSource.paginator = this.paginator;
        this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));
        console.log('PaginationInformation: ', this.paginationInformation);
        this.paginator.length = this.paginationInformation.TotalCount;
        this.paginatorLength = this.paginationInformation.TotalCount;
        this.dataSource.sort = this.sort;
        if (response.body.length === 0) {
          PNotify.error({
            title: 'There are no records in selected date range ',
            minHeight: '75px'
          });
          return;
        }
        PNotify.success({
          title: 'Report fetched successfully',
          minHeight: '75px',
        });
      }, (error) => {
        console.log('An error occured while fetching reports: ', error);
        PNotify.error({
          title: 'An error occured while fetching report',
          minHeight: '75px'
        });
      });
  }
}
