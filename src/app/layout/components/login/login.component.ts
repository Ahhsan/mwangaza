import { Component, OnInit } from '@angular/core';

import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../../app/services/login/login.service';
import { error } from 'protractor';
import PNotify from 'pnotify/dist/es/PNotify';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    dataSending = false;
    user = {
        email: '',
        password: ''
    };
    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private loginService: LoginService,
    ) {

    }

    ngOnInit() {
    }

    loginUser() {
        this.dataSending = true;
        // this.loginService.login(this.user).subscribe((response: any) => {
        //   console.log('Response of login: ', response);
        //   localStorage.setItem('refreshToken', response.refreshToken);
        //   localStorage.setItem('token', response.token);
        //   PNotify.success({
        //     title: 'Logged in Successfully',
        //     minHeight: '75px'
        //   });
        //   this.dataSending = false;
        this.router.navigate(['saveSalesPerson']);
        // }, (error: any) => {
        //   if (error.status === 400) {
        //     PNotify.error({
        //       title: error.error.errors[0],
        //       minHeight: '75px'
        //     });
        //     this.dataSending = false;
        //   }
        //   console.log('Error occured while logging: ', error);
        //   this.dataSending = false;
        // });

    }

}
