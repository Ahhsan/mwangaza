import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class SalesPersonService {

    URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/SalesPersons';

    constructor(private http: HttpClient) {}

    // tslint:disable:typedef
    getSalesPersons() {
        return this.http.get(this.URL);
    }

    getSalesPerson(id) {
        return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/SalesPersons/${id}`);
    }

    addSalesPerson(person) {
        return this.http.post(this.URL, person);
    }

    updateSalesPerson(person, id) {
        return this.http.put(`https://loan-management-solution20191108021340.azurewebsites.net/api/SalesPersons/${id}`, person);
    }

    delete(id) {
        return this.http.delete(`https://loan-management-solution20191108021340.azurewebsites.net/api/SalesPersons/${id}`);
    }
}
