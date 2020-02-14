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

  getFactory(){
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactory`);
  }
  getFactoryPagination(key: string, page: string, pageSize: string){
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactoryPagination`,{ params: {
      key: key,
      page: page,
      pageSize:pageSize 
    }});
  }
  getFactoryById(id: string){
    return this.http.get<any>(`${ApiUrl}/Factory/FindFactoryById`,{ params: {  id: id } } );
  }
  AddFactoryFile(entity: any){
    return this.http.post(`${ApiUrl}/PlanSchedule/AddFactoryFile`, entity);
  }
  UpdateFactory(entity: any){
    return this.http.put(`${ApiUrl}/PlanSchedule/AddFactoryFDeleteFactoryFileile`, entity);
  }
  DeleteFactory(){
    return null;
  }








  


  
}