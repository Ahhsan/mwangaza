import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CustomerService} from '../../../../services/customer/customer.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {

    processing = false;
    customerList;
    filteredCustomerList;
    displayedColumns: string[] = ['name', 'gender', 'phone1', 'county', 'subCounty', 'address', 'edit'];
    @ViewChild(MatPaginator, {
        static: true
    }) paginator: MatPaginator;
    @ViewChild(MatSort, {
        static: true
    }) sort: MatSort;
    dataSource;
    genderFilter;
    nameFilter;

    constructor(private router: Router, private customerService: CustomerService) {}

    // tslint:disable:typedef
    ngOnInit() {
        this.processing = true;
        this.getAll();
    }

    getAll() {
        this.customerService.getCustomers().subscribe((response) => {
            this.customerList = response;
            this.customerList.sort((a, b) => (a.customerId < b.customerId) ? 1 : -1);
            this.dataSource = new MatTableDataSource(this.customerList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.processing = false;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    updatePerson(customerId) {
        this.router.navigate(['newcustomer', {
            customerId: customerId
        }]);
    }

    applyDataFilter() {
        this.filteredCustomerList = this.customerList.filter(element =>
            element.name === this.nameFilter
        );
        this.dataSource = new MatTableDataSource(this.filteredCustomerList);
    }

    resetDateFilters() {
        this.dataSource = new MatTableDataSource(this.customerList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    delete(id, name) {
        this.processing = true;
        this.customerService.delete(id).subscribe((response) => {
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
