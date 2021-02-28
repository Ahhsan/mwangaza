import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanPaymentService {

  URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/LoanPayments/MakePayment"
  constructor(private http: HttpClient) { }

  makePayment(payment) {
    console.log('Payment going to be made: (service file): ', payment)
    return this.http.post(this.URL, payment)
  }
}
