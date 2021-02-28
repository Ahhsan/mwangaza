import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class ProductService {
    
    URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Products';

    constructor(private http: HttpClient) {}

    // tslint:disable:typedef
    getProducts() {
        return this.http.get(this.URL);
    }

    getProduct(id) {
        return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/Products/${id}`);
    }

    addProduct(product) {
        return this.http.post(this.URL, product);
    }

    updateProduct(product, id) {
        return this.http.put(`https://loan-management-solution20191108021340.azurewebsites.net/api/Products/${id}`, product);
    }

    delete(id) {
        return this.http.delete(`https://loan-management-solution20191108021340.azurewebsites.net/api/Products/${id}`);
    }
}
