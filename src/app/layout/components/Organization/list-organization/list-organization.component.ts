import {Component, OnInit, ViewChild} from '@angular/core';
import {OrganizationService} from '../../../../services/organization/organization.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
    selector: 'app-list-organization',
    templateUrl: './list-organization.component.html',
    styleUrls: ['./list-organization.component.scss']
})

export class ListOrganizationComponent implements OnInit {
    
    processing = false;
    displayedColumns: string[] = ['organizationName', 'county', 'subCounty', 'contactPersonName', 'contactPersonEmail', 'contactPersonPone', 'edit'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    organizationList;
    dataSource;

    constructor(private organizationService: OrganizationService, private router: Router) {}

    // tslint:disable:typedef
    ngOnInit() {
        this.processing = true;
        this.getAll();
    }

    getAll() {
        this.organizationService.getOrganizations().subscribe((response) => {
            this.organizationList = response;
            this.organizationList.sort((a, b) => (a.orginizationId < b.orginizationId) ? 1 : -1);
            this.dataSource = new MatTableDataSource(this.organizationList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.processing = false;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    updateOrganization(organizationId) {
        this.router.navigate(['neworganization', {
            organizationId: organizationId
        }]);
    }

    delete(id, name) {
        this.processing = true;
        this.organizationService.delete(id).subscribe((response) => {
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
