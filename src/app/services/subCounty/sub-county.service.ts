import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SubCountyService {
  URL='https://loan-management-solution20191108021340.azurewebsites.net/api/SubCounties';
  constructor(private httpClient:HttpClient) { }
  getSubCounties(){
    return this.httpClient.get(this.URL)
  }
}
