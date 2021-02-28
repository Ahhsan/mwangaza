import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Reports/SalesReport'
  private headers = {
    "startDate": "2020-01-20T14:00:31.567Z",
    "endDate": "2020-01-20T14:00:31.567Z",
    "pageNumber": 0,
    "pageSize": 25,
    "orderByField": 0,
    "orderBy": 1,
    "searchFieldType": 0,
    "searchTerm": "string"
  }
  constructor(private http: HttpClient) {
    const currentDay = moment().date();
    const startDate = moment().date(1).hour(12).minute(0).second(0);
    const endDate = moment().hour(23).minute(59).second(59);
    this.headers.startDate = startDate.format();
    this.headers.endDate = endDate.format();
    console.log('Headers of sales request: ', this.headers);
  }
  getDailyReport() {
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getFilteredReport(customStartDate, customEndDate, searchField, searchTerm) {
    // console.log('StartDate: ', customStartDate, 'EndDate: ', customEndDate);
    this.headers.startDate = customStartDate;
    this.headers.endDate = customEndDate;
    this.headers.searchFieldType = searchField;
    this.headers.searchTerm = searchTerm;
    this.headers.pageSize = 25;
    this.headers.pageNumber = 0;
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getNextPage(currentPageNumber) {
    this.headers.pageNumber = currentPageNumber + 1;
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getPreviousPage(currentPageNumber) {
    this.headers.pageNumber = currentPageNumber - 1;
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getLastPage(lastPageNumber) {
    this.headers.pageNumber = lastPageNumber;
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getFirstPage() {
    this.headers.pageNumber = 0;
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
}
