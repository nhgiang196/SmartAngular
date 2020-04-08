import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
const ApiUrl = environment.apiUrl;
@Injectable({providedIn: 'root'})
export class BomService {
  constructor(private http: HttpClient) {}

  addBomFactory =(entity) => this.http.post(`${ApiUrl}/BomFactory/AddBomFactory`,entity);
   updateBomFactory =(entity) => this.http.put(`${ApiUrl}/BomFactory/UpdateBomFactory`,entity);
   deleteBomFactory =(id) => this.http.delete(`${ApiUrl}/BomFactory/DeleteBomFactory`,{ params: { id: id } });
   getBomFactory =() => this.http.get(`${ApiUrl}/BomFactory/GetBomFactory` );
   findBomFactoryById =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/FindBomFactoryById?id=${id}` );

   validateBomFactory =(entity) =>this.http.post(`${ApiUrl}/BomFactory/ValidateBomFactory`,entity);
   getAllUnitByItemId =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/GetAllUnitByItemId?id=${id}` );

}
