import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ProductService} from '../../../../services/product/product.service';
import {LoanTermService} from '../../../../services/loanTerms/loan-term.service';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {

    processing = false;
    dataArrived = false;
    displayedColumns: string[] = ['name', 'recomendedRetailPrice', 'loanTermId', 'edit'];
    @ViewChild(MatPaginator, {
        static: true
    }) paginator: MatPaginator;
    @ViewChild(MatSort, {
        static: true
    }) sort: MatSort;
    dataSource;
    productList;

    constructor(private router: Router, private productService: ProductService, private loanTermService: LoanTermService) {}

    // tslint:disable:typedef
    ngOnInit() {
        this.processing = true;
        this.getAll();
    }

    getAll() {
        this.productService.getProducts().subscribe(list => {
            this.productList = list;
            this.productList.sort((a, b) => (a.productId < b.productId) ? 1 : -1);
            this.productList.forEach(product => {
                this.loanTermService.getLoanTerm(product.loanTermId).subscribe((response: any) => {
                    product.recomendedLoanTerm = response.numberOfMonths;
                    this.dataArrived = true;
                }, error => console.log('An error occured while getting loan terms', error));
            });
            this.dataSource = new MatTableDataSource(this.productList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.processing = false;
        }, (err) => {
            console.log('Following error occured: ', err);
            this.processing = false;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    updateProduct(productId) {
        this.router.navigate(['newproduct', {
            productId: productId
        }]);
    }
    
    delete(id, name){
        this.processing = true;
        this.productService.delete(id).subscribe((response) => {
            this.getAll();
            PNotify.success({
                title: 'Successfully removed record',
                text: 'The record \"' + name + '\" has been removed from the server and the table has been updated.',
                minHeight: '75px'
            });
        }, (error) => {
            console.log('Error occured while removing the record from the server.: ', error);
            PNotify.error({
              title: 'Error occured while removing',
              text: 'Error occured while removing the record from the server.',
              minHeight: '75px'
            });
            this.processing = false;
        });
      }
}
