import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CustomerService {

    URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Customers';

    constructor(private http: HttpClient) { }

    // tslint:disable:typedef
    getCustomers() {
        return this.http.get(this.URL);
    }

    getCustomer(id) {
        return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/Customers/${id}`);
    }

    addCustomer(customer) {
        return this.http.post(this.URL, customer);
    }

    updateCustomer(customer, id) {
        return this.http.put(`https://loan-management-solution20191108021340.azurewebsites.net/api/Customers/${id}`, customer);
    }

    delete(id) {
        return this.http.delete(`https://loan-management-solution20191108021340.azurewebsites.net/api/Customers/${id}`);
    }
}
