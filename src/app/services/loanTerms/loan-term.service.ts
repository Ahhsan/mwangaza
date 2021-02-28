import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanTermService {
  URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/LoanTerms"
  constructor(private http: HttpClient) {
  }
  getLoanTerms() {
    return this.http.get(this.URL)
  }
  postLoanTerm(term) {
    console.log('Loan term going to be added: ', term);
    return this.http.post(this.URL, term);
  }
  getLoanTerm(id) {
    return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/LoanTerms/${id}`);
  }
  getLoanTermById(id) {
    return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/LoanTerms/${id}`).toPromise();
  }
}
