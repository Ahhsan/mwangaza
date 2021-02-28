import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  URL = "https://loan-management-solution20191108021340.azurewebsites.net/api/Identity/register"
  constructor(private http: HttpClient) { }

  registerAdmin(admin) {
    console.log('Adming going to be created is: (service file) ', admin)
    return this.http.post(this.URL, admin)
  }
  getAdmins() {
    return this.http.get(`https://loan-management-solution20191108021340.azurewebsites.net/api/Identity`)
  }
  manageActivity(admin) {
    console.log('Admin going to be updated: ', admin)
    return this.http.post(`https://loan-management-solution20191108021340.azurewebsites.net/api/Identity/ManageActivity`, admin)
  }
}
