import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AmountCollectedReportService {
  private URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/Reports/AmountCollectedReport";
  private headers = {
    "startDate": "2020-01-20T13:34:53.348Z",
    "endDate": "2020-01-20T13:34:53.348Z",
    "pageNumber": 0,
    "pageSize": 25,
    "orderByField": 0,
    "orderBy": 1,
    "searchFieldType": 0,
    "searchTerm": "string"
  }
  currentDay = moment().date();
  startDate = moment().date(1).hour(12).minute(0).second(0);
  endDate = moment().hour(23).minute(59).second(59);
  constructor(private http: HttpClient) {


    this.headers.startDate = this.startDate.format();
    this.headers.endDate = this.endDate.format();
    console.log('Headers of amount collected request: ', this.headers);
  }

  getDailyReport() {
    return this.http.post(this.URL, this.headers, { observe: 'response' });
  }
  getFilteredReport(selectedMonthYear, searchField, searchTerm) {

    // getting the number of days in current month
    const daysInMonth = selectedMonthYear.daysInMonth();

    let selectedMonth = selectedMonthYear.month() + 1;
    // console.log('Selected Month: ', selectedMonth)
    this.headers.startDate = selectedMonthYear.date(1).hour(12).minute(0).second(0).format();
    this.headers.endDate = selectedMonthYear.date(daysInMonth).format();

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
