import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.scss']
})
export class NewAdminComponent implements OnInit {
  dataSending = false;
  adminId;
  updateAdmin;
  newAdminForm: FormGroup;
  confirmPassword;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService) {
    this.route.paramMap.subscribe((params) => {
      this.adminId = params.get('adminId');
      console.log('ID received to this component: ', this.adminId);
      console.log(this.adminId);
      if (this.adminId) {
        // this.updateAdmin = mockData.filter(admin => this.adminId == admin.ID)[0];
        console.log('Admin to show in this form is: ', this.updateAdmin);
        this.newAdminForm = this._formBuilder.group({
          firstName: [this.updateAdmin.name, Validators.required],
          lastName: [this.updateAdmin.email, Validators.required],
          role: [this.updateAdmin.password, Validators.required],
          email: [this.updateAdmin.password, Validators.required],
          password: [this.updateAdmin.password, Validators.required],
          isActive: [this.updateAdmin.password, Validators.required],
        })
      }
      else {
        this.newAdminForm = this._formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          role: ['', Validators.required],
          email: ['', Validators.required],
          password: ['', Validators.required],
          isActive: ['', Validators.required],
        });
      }
    });
  }

  ngOnInit(): void {

  }
  postAdmin(admin): void {

    console.log('Confirmed Password: ', this.confirmPassword);
    if (this.confirmPassword !== this.newAdminForm.value.password) {
      PNotify.error({
        title: 'Password does not match',
        height: '75px'
      });
      return;
    }
    // document.getElementById('submitButton').style.display = 'none';
    this.dataSending = true;
    this.adminService.registerAdmin(admin).subscribe((response) => {
      console.log('Admin registered successfully')
      PNotify.success({
        title: 'Admin registered successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial';
      this.dataSending = false;
      this.router.navigate(['searchadmin']);
    }, (error) => {
      console.log('Error while registering admin: ', error);
      if (error.status === 400) {
        PNotify.error({
          title: 'Authentication Error',
          text: 'Password must meet the given criteria',
          minHeight: '75px'
        });
        this.dataSending = false;
      }
      else {
        PNotify.error({
          title: 'Error while registering admin',
          text: 'Failed to register new admin',
          minHeight: '75px'
        });
      }
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    });
  }
}