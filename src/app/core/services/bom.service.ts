import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class BomService {
  constructor(private http: HttpClient) {

  }

  addBomFactory =(entity) => this.http.post(`${ApiUrl}/BomFactory/AddBomFactory`,entity);
   updateBomFactory =(entity) => this.http.put(`${ApiUrl}/BomFactory/UpdateBomFactory`,entity);
   getDataTableBomFactoryPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/BomFactory/DataTableBomFactoryPagination`,entity);
   deleteBomFactory =(id) => this.http.delete(`${ApiUrl}/BomFactory/DeleteBomFactory`,{ params: { id: id } });
   getBomFactoryPagination =(entity) => this.http.post<any>(`${ApiUrl}/BomFactory/GetBomFactoryPagination`,entity,{} );
   getBomFactory =() => this.http.get(`${ApiUrl}/BomFactory/GetBomFactory` );
   findBomFactoryById =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/FindBomFactoryById?id=${id}` );
   
   validateBomFactory =(entity) =>this.http.post(`${ApiUrl}/BomFactory/ValidateBomFactory`,entity);
   getAllUnitByItemId =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/GetAllUnitByItemId?id=${id}` );
}
