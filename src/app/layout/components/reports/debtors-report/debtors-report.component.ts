import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DebtorsReportService } from 'app/services/reportServices/debtors-report/debtors-report.service';
import PNotify from 'pnotify/dist/es/PNotify';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-debtors-report',
  templateUrl: './debtors-report.component.html',
  styleUrls: ['./debtors-report.component.scss']
})
export class DebtorsReportComponent implements OnInit {
  dataArrived = false;
  // tslint:disable-next-line: max-line-length
  displayedColumns: string[] = ['invoiceDate', 'invoiceNumber', 'organizationName', 'customerName', 'salesPersonName', 'authorizingOfficerName', 'productName', 'loanTerm', 'quantity', 'price', 'amount'];
  footerColumns: string[] = ['amount', 'dueAmount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  fromDate = moment().date(1).hour(12).minute(0).second(0);
  tillDate = moment().hour(23).minute(59).second(59);
  searchUsing;
  searchFor;
  paginationInformation;
  pageIndex = 1;
  pageNumber;
  paginatorLength;
  constructor(private debtorsReportService: DebtorsReportService) { }
  private reports: any;

  ngOnInit(): void {
    this.paginator.pageSize = 25;
    this.debtorsReportService.getDailyReport().subscribe((response) => {
      console.log('Response of debtors report : ', response);
      this.reports = response.body;
      this.paginationInformation = JSON.parse(response.headers.get('X-Pagination'));

      this.paginator.length = this.paginationInformation.TotalCount;
      this.paginatorLength = this.paginationInformation.TotalCount;
      this.paginator.pageIndex = 0;


      this.dataSource = new MatTableDataSource(this.reports);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => console.log('Error occured while fetching debtors report: ', error));

  }
  onPageChange(event) {
    console.log('Paginator event: ', event);


    // Check if the event of first page is triggered
    if (event.pageIndex === 0) {
      console.log('FIRST PAGE BUTTON CALLED')
      this.debtorsReportService.getFirstPage().subscribe((response) => {
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
      this.debtorsReportService.getLastPage(this.paginationInformation.TotalPages).subscribe((response) => {
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
      this.debtorsReportService.getNextPage(this.paginationInformation.CurrentPage).subscribe(response => {
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
      this.debtorsReportService.getPreviousPage(this.paginationInformation.CurrentPage).subscribe(response => {
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

    this.debtorsReportService.getFilteredReport(sDate.format(), eDate.format(), this.searchUsing, this.searchFor)
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
