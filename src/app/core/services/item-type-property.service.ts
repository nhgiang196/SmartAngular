import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/datatable';

import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class ItemTypePropertyService {
  constructor(private http: HttpClient) {

  }

  addItemTypeProperty =(entity) => this.http.post(`${ApiUrl}/ItemTypeProperty/AddItemTypeProperty`,entity);
  updateItemTypeProperty =(entity) => this.http.put(`${ApiUrl}/ItemTypeProperty/UpdateItemTypeProperty`,entity);
  getDataTableItemTypePagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/ItemType/DataTableItemTypePagination`,entity);
  deleteItemTypeProperty =(id) => this.http.delete(`${ApiUrl}/ItemTypeProperty/DeleteItemTypeProperty`,{ params: { id: id } });
  getItemTypePropertyPagination =(entity) => this.http.post<any>(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyPagination`,entity,{} );
  getItemTypeProperty =() => this.http.get(`${ApiUrl}/ItemTypeProperty/GetItemType` );
  findItemTypePropertyById =(id) => this.http.get<any>(`${ApiUrl}/ItemTypeProperty/FindItemTypePropertyById?id=${id}` );
}
