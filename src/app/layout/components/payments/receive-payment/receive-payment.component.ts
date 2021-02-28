import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { LoanService } from '../../../../services/loan/loan.service';
@Component({
  selector: 'app-receive-payment',
  templateUrl: './receive-payment.component.html',
  styleUrls: ['./receive-payment.component.scss']
})
export class ReceivePaymentComponent implements OnInit {
  loanList
  displayedColumns: string[] = ['invoiceNumber', 'invoiceDate', 'notes', 'customerId', 'edit'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  constructor(private route: ActivatedRoute, private router: Router, private loanService: LoanService) {
    this.loanService.getLoans().subscribe((response) => {
      this.loanList = response;
      console.log('Loanlist received from server is: ', this.loanList)
      // console.log('Type of invoiceDate is: ',typeof(this.loanList[1].invoiceDate))
      console.log('Value of dataArrived changed to true')
      this.dataSource = new MatTableDataSource(this.loanList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    },
      (err) => {
        console.log('Following error occured: ', err)
      })
  }
  ngOnInit() {
  }
  gotoMakePayment(loanId) {
    this.router.navigate(['makePayments', { loanId: loanId }])
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}