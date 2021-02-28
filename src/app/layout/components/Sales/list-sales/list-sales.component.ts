import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SalesPersonService} from '../../../../services/sales person/sales-person.service';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
    selector: 'app-list-sales',
    templateUrl: './list-sales.component.html',
    styleUrls: ['./list-sales.component.scss']
})

export class ListSalesComponent implements OnInit {

    processing = false;
    displayedColumns: string[] = ['name', 'gender', 'phone1', 'email', 'county', 'team', 'teamLeader', 'address', 'edit'];
    @ViewChild(MatPaginator, {
        static: true
    }) paginator: MatPaginator;
    @ViewChild(MatSort, {
        static: true
    }) sort: MatSort;
    dataSource;
    salesPersonList;

    constructor(private router: Router, private salesPersonService: SalesPersonService) {}

    // tslint:disable:typedef
    ngOnInit() {
        this.processing = true;
        this.getAll();
    }

    getAll() {
        this.salesPersonService.getSalesPersons().subscribe((response) => {
            this.salesPersonList = response;
            this.salesPersonList.sort((a, b) => (a.salesPersonId < b.salesPersonId) ? 1 : -1);
            this.dataSource = new MatTableDataSource(this.salesPersonList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.processing = false;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    updatePerson(salesPersonId) {
        this.router.navigate(['saveSalesPerson', {
            salesPersonId: salesPersonId
        }]);
    }

    delete(id, name) {
        this.processing = true;
        this.salesPersonService.delete(id).subscribe((response) => {
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
