import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanProductService {
  URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/LoanProducts";
  constructor(private http: HttpClient) {
  }
  addLoanProduct(loanProducts) {
    console.log('Loan products going to be added are (service file): ', loanProducts[0]);
    return this.http.post(this.URL, loanProducts[0]);
  }
  getLoanProductByLoanId(id) {
    return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/LoanProducts/GetLoanProductsByLoanId/${id}`).toPromise();
  }
}
