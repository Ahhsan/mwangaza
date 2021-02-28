import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CountyService {

  URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Counties';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getCounties() {
     return this.http.get(this.URL);     
  }

}
