import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from '../../../../services/loan/loan.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  loanList;
  dataArrived = false;
  displayedColumns: string[] = ['invoiceNumber', 'invoiceDate', 'notes', 'customerId', 'payment'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  constructor(private loanService: LoanService, private router: Router) {

  }

  ngOnInit() {
    this.loanService.getLoans().subscribe((response) => {
      this.loanList = response;
      console.log('Loanlist received from server is: ', this.loanList);
      this.loanList.sort((a, b) => (a.loanId < b.loanId) ? 1 : -1);
      // console.log('Sorted loanlist: ', this.loanList);
      this.dataArrived = true;
      // console.log('Type of invoiceDate; is: ',typeof(this.loanList[1].invoiceDate))
      // console.log('Value of dataArrived changed to true')
      this.dataSource = new MatTableDataSource(this.loanList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      (err) => {
        console.log('Following error occured: ', err);
      })
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  gotoMakePayment(loanId) {
    this.router.navigate(['makePayments', { loanId: loanId }])
  }

}
