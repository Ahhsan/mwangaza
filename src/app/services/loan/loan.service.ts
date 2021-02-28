import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoanService {
  URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/Loans"
  constructor(private http: HttpClient) { }
  getLoans() {
    return this.http.get(this.URL);
  }
  getLoan(id) {
    return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/Loans/${id}`);
  }
  postLoan(loan) {
    // loan.removeControl('customer')
    // loan.removeControl('salesPerson')
    // loan.removeControl('organization')
    delete loan.customer
    delete loan.salesPerson
    delete loan.organization
    console.log('Loan going to be added (from service file): ', loan);
    return this.http.post(this.URL, loan);
  }
}
