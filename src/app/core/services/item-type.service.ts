import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
import { StageService } from './stage.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`
@Injectable({ providedIn: 'root' })

export class ItemTypeService {
  constructor(private http: HttpClient, private stageService: StageService) { }
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
  dataGridItemType = () => this.http.get(`${ApiUrl}/ItemType/DataGridItemTypePagination`);

  // cách 1 Unsport mediaType phải gửi format Application/json
  // getDataGridItemType() {
  //   return createStore({
  //     key: "ItemTypeId",
  //     loadUrl: `${ApiUrl}/ItemType/DataGridItemTypePagination`,
  //     insertUrl: `${ApiUrl}/ItemType/AddItemType`,
  //     updateUrl: `${ApiUrl}/ItemType/UpdateItemType`,
  //     deleteUrl: `${ApiUrl}/ItemType/DeleteItemType`,
  //     onBeforeSend: (method, ajaxOptions) => {
  //       ajaxOptions.xhrFields = { withCredentials: true };
  //     }
  //   });
  // }

  // cách 2
  getDataGridItemType() {
    return new CustomStore({
      key: "ItemTypeId",
      load: () => this.dataGridItemType().toPromise().then(),//this.stageService.sendRequest(ApiUrl + "/ItemType/DataGridItemTypePagination"),
      insert: (values) => this.addItemType(values).toPromise().then(),
      update: (key, values) =>  this.updateItemType(values).toPromise().then(), // no need key here
      remove: (key) =>  this.deleteItemType(key).toPromise().then()
    });
  }
}
