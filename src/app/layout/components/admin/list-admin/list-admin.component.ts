import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../../../../services/admin/admin.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {
  adminList;
  displayedColumns: string[] = ['name', 'email', 'password', 'status'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  constructor(
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.getAdmins();
  }
  getAdmins(): void {
    this.adminService.getAdmins().subscribe((response: any) => {
      this.adminList = response.users;
      // console.log('List received from the server: ', response);
      this.dataSource = new MatTableDataSource(this.adminList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error) => {
      console.log('Error occured while fetching admin list: ', error);
    });

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  updateAdmin(adminId) {
    this.router.navigate(['newadmin', { adminId: adminId }]);
  }

  changeStatus(admin): void {
    console.log('Received admin is: ', admin);
    const dialogRef = this.dialog.open(adminDialog, {
      width: '250px',
      data: {
        dataKey: admin
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAdmins();

    });

  }

}

@Component({
  selector: 'adminDialog',
  template: `<h4 mat-dialog-title>Are you sure want to change the status of admin ? </h4>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">NO</button>
    <button mat-button (click)="onYesClick()" cdkFocusInitial>YES</button>
  </div>`,
})
export class adminDialog {
  adminStatus = { id: '', markUserActive: undefined };
  constructor(
    public dialogRef: MatDialogRef<adminDialog>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public admin: any,
  ) {
    console.log('Admin received to dialog: ', admin);
    this.adminStatus.id = admin.dataKey.id;
    this.adminStatus.markUserActive = !admin.dataKey.isActive;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {

    // this.adminStatus.markUserActive = true;
    this.adminService.manageActivity(this.adminStatus).subscribe(response => {
      // console.log('Response received after changing the status: ', response);
      PNotify.success({
        title: `Status of ${this.admin.dataKey.userName} changed successfully`,
        minHeight: '75px'
      });
      this.dialogRef.close();
    }, error => {
      console.log('Error occured while deactiviting admin: ', error);
      PNotify.error({
        title: 'Error while changing status',
        minHeight: '75px'
      });
    });

  }
}
