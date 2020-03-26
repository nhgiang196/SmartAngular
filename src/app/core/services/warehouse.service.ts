import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class WareHouseService {
  constructor(private http: HttpClient) {

  }

  getPagination =(keyvalue, page, pageSize) => { 
    let pr = new DataTablePaginationParams();
    pr.key = keyvalue;
    pr.page = page<1? 1 : page;
    pr.pageSize = pageSize;
    return this.http.post<any>(`${ApiUrl}/Warehouse/GetPaginationByStored`,pr);
  };
  get =() => this.http.get(`${ApiUrl}/Warehouse/Get` );
  findById =(id) => this.http.get<any>(`${ApiUrl}/Warehouse/FindById?id=${id}` );
  add =(entity) => this.http.post(`${ApiUrl}/Warehouse/Add`,entity);
  update =(entity) => this.http.put(`${ApiUrl}/Warehouse/Update`,entity);
  delete =(id) => this.http.delete(`${ApiUrl}/Warehouse/Delete?id=${id}`);
  validate =(entity) => this.http.post(`${ApiUrl}/Warehouse/Validate?`,entity);
  validateLocation =(entity) => this.http.post(`${ApiUrl}/Warehouse/ValidateLocation?`,entity);
}
