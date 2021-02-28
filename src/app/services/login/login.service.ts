import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountyService } from 'app/services/county/county.service';
import PNotify from 'pnotify/dist/es/PNotify';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Identity/login'
  constructor(private http: HttpClient,
    private countyService: CountyService) {
    countyService.getCounties().subscribe((resp) => {
      console.log('Response: ', resp);
    }, (error) => {
      if (error.status === 401) {
        console.log('Error: ', error);
        PNotify.error({
          title: 'Your session has expired, please log in again',
          minHeight: '75px'
        });
      }
    });
  }
  login(credentials) {
    console.log('User going to be logged in: ', credentials);
    return this.http.post(this.URL, credentials);
  }
  refresh() {
    let rToken = { token: '', refreshToken: '' }
    rToken.token = localStorage.getItem('token');
    rToken.refreshToken = localStorage.getItem('refreshToken');
    console.log(rToken);
    // console.log('RefreshToken: ', refreshToken);
    return this.http.post(`https://loan-management-solution20191108021340.azurewebsites.net/api/Identity/Refresh`, rToken);
  }
  // Method to check if the user is loggedIn or not
  loggedIn() {
    return !!localStorage.getItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }

}
