import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Factory, FactoryFile, FactoryTechnology, DataTablePaginationParram } from '../models/SmartInModels';

const ApiUrl = "api/v1";


@Injectable({ providedIn: 'root' })
export class WaterTreatmentService {
  constructor(
    private http: HttpClient, private router: Router
  ) { }

  // public BasicData = {
  // Users: [],
  // }

  getUser() {
    return this.http.get<any>(`${ApiUrl}/User/getUser`);
  }
  addUser(entity: any) {
    return this.http.post(`${ApiUrl}/User/AddUser`, entity);
  }
  updateUser(entity: any) {
    return this.http.put(`${ApiUrl}/User/UpdateUser`, entity);
  }

  /** FACTORY */
  getFactory() {
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactory`);
  }
  getFactoryPagination(pr) {
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactoryPagination`, {
      params: {
        key: pr.key
        , keyFields: pr.keyFields
        , page: pr.page
        , pageSize: pr.pageSize
        , orderBy: pr.orderBy
        , orderDir: pr.orderDir
      }
    });
  }

  getFactoryById(id) {
    return this.http.get<any>(`${ApiUrl}/Factory/FindFactoryById`, { params: { id: id } });
  }

  addFactory(entity) {
    return this.http.post(`${ApiUrl}/Factory/AddFactory`, entity);
  }
  updateFactory(entity) {
    return this.http.put(`${ApiUrl}/Factory/UpdateFactory`, entity);
  }
  deleteFactory(id) {
    return this.http.delete(`${ApiUrl}/Factory/DeleteFactory`, { params: { id: id } });
  }

  
  

  /** FACTORYFILE */

  AddFactoryFile(entity) {
    return this.http.post(`${ApiUrl}/PlanSchedule/AddFactoryFile`, entity);
  }
  UpdateFactory(entity) {
    return this.http.put(`${ApiUrl}/PlanSchedule/AddFactoryFDeleteFactoryFileile`, entity);
  }
  /**FILES */
  uploadFile(formData, pathFile){
    return this.http.post(`${ApiUrl}/File/UploadFiles/${pathFile}`,  formData);
  }
  deleteFile(fileName){
    return this.http.delete(`${ApiUrl}/File/DeleteFiles`, { params: { fileName: fileName } });
  }


}