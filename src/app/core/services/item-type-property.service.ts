import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`
@Injectable({providedIn: 'root'})
export class ItemTypePropertyService {
  constructor(private http: HttpClient) {

  }
  addItemTypeProperty = (entity) => this.http.post(`${ApiUrl}/ItemTypeProperty/AddItemTypeProperty`, entity);
  updateItemTypeProperty = (entity) => this.http.put(`${ApiUrl}/ItemTypeProperty/UpdateItemTypeProperty`, entity);
  deleteItemTypeProperty = (id) => this.http.delete(`${ApiUrl}/ItemTypeProperty/DeleteItemTypeProperty`, { params: { id: id } });
  getItemTypePropertyPagination = (entity) => this.http.post<any>(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyPagination`, entity, {});
  getItemTypePropertyToSelect2 = (keyword, code) =>
    this.http.get<any>(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyPaginationByCodeToSelect2/${code}?keyword=` + keyword);
  getItemTypeProperty = () => this.http.get(`${ApiUrl}/ItemTypeProperty/GetItemTypeProperty`);
  findItemTypePropertyById = (id) => this.http.get(`${ApiUrl}/ItemTypeProperty/FindItemTypePropertyById?id=${id}`);
  getItemTypePropertyPaginationByCode = (entity, code) => this.http.post<any>(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyPaginationByCode/${code}`, entity, {});
  validateItemTypeProperty = (entity) => this.http.post(`${ApiUrl}/ItemTypeProperty/ValidateItemTypeProperty`, entity);
  
  getDataGridItemTypeProperty(dataSource, key) {
    dataSource = AspNetData.createStore({
      key: key,
      loadUrl: `${ApiUrl}/ItemTypeProperty/DataGridItemTypePropertyPagination`,
      insertUrl: NULL_ROUTES,
      updateUrl: NULL_ROUTES,
      deleteUrl: NULL_ROUTES,
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.data.key = key;
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    });
    return dataSource;
  }
  getDataGridItemTypePropertyByItemTypeId(dataSource, key, itemTypeId) {
    dataSource = AspNetData.createStore({
      key: key,
      loadUrl: `${ApiUrl}/ItemTypeProperty/GetItemTypePropertyDataGridPaginationByItemTypeId`,
      insertUrl: NULL_ROUTES,
      updateUrl: NULL_ROUTES,
      deleteUrl: NULL_ROUTES,
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.data.key = key;
        ajaxOptions.data.itemTypeId = itemTypeId,
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    });
    return dataSource;
  }
}
