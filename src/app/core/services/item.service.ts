import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
const ApiUrl = environment.apiUrl;;
@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) {}

  addItem = (entity) => this.http.post(`${ApiUrl}/Item/AddItem`, entity);
  updateItem = (entity) => this.http.put(`${ApiUrl}/Item/UpdateItem`, entity);
  deleteItem = (id) => this.http.delete(`${ApiUrl}/Item/DeleteItem`, { params: { id: id } });
  getItem = () => this.http.get(`${ApiUrl}/Item/GetItem`);
  findItemById = (id) => this.http.get<any>(`${ApiUrl}/Item/FindItemById?id=${id}`);
  checkItemNameExist = (itemName) => this.http.get<any>(`${ApiUrl}/Item/CheckItemNameExist?ItemName=${itemName}`);
}
