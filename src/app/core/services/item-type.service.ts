import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`
@Injectable({ providedIn: 'root' })
export class ItemTypeService {
  constructor(private http: HttpClient) {}
  addItemType = (entity) => this.http.post(`${ApiUrl}/ItemType/AddItemType`, entity);
  updateItemType = (entity) => this.http.put(`${ApiUrl}/ItemType/UpdateItemType`, entity);
  deleteItemType = (id) => this.http.delete(`${ApiUrl}/ItemType/DeleteItemType`, { params: { id: id } });
  getItemTypePagination = (entity) => this.http.post<any>(`${ApiUrl}/ItemType/GetItemTypePagination`, entity, {});
  getItemTypeToSelect2 = (keyword, code) =>
    this.http.get<any>(`${ApiUrl}/ItemType/GetItemTypePaginationByCodeToSelect2/${code}?keyword=` + keyword);
  getItemType = () => this.http.get(`${ApiUrl}/ItemType/GetItemType`);
  findItemTypeById = (id) => this.http.get(`${ApiUrl}/ItemType/FindItemTypeById?id=${id}`);
  getItemTypePaginationByCode = (entity, code) => this.http.post<any>(`${ApiUrl}/ItemType/GetItemTypePaginationByCode/${code}`, entity, {});
  validateItemType = (entity) => this.http.post(`${ApiUrl}/ItemType/ValidateItemType`, entity);

  getDataGridItemType(dataSource, key) {
    dataSource = AspNetData.createStore({
      key: key,
      loadUrl: `${ApiUrl}/ItemType/DataGridItemTypePagination`,
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
}
