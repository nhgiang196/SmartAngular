import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const ApiUrl = "api/v1";


@Injectable({providedIn: 'root'})
export class WaterTreatmentService {
  constructor(
    private http: HttpClient, private router: Router
  ) { }

  // public BasicData = {
  //   Users: [],
  // }

  getUser() {
    return this.http.get<any>(`${ApiUrl}/User/getUser`);
  }
  addUser(entity: any) {
    return this.http.post(`${ApiUrl}/User/AddUser`,entity);
  }
  updateUser(entity: any) {
    return this.http.put(`${ApiUrl}/User/UpdateUser`, entity);
  }





  


  
}