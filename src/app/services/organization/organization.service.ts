import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class OrganizationService {

    URL = 'https://loan-management-solution20191108021340.azurewebsites.net/api/Orginizations';

    constructor(private http: HttpClient) {}

    // tslint:disable:typedef
    getOrganizations() {
        return this.http.get(this.URL);
    }

    getOrganization(id) {
        return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/Orginizations/${id}`);
    }

    addOrganization(organization) {
        return this.http.post(this.URL, organization);
    }

    updateOrganization(organization, organizationId) {
        return this.http.put(`https://loan-management-solution20191108021340.azurewebsites.net/api/Orginizations/${organizationId}`, organization);
    }

    delete(id) {
        return this.http.delete(`https://loan-management-solution20191108021340.azurewebsites.net/api/Orginizations/${id}`);
    }
}
