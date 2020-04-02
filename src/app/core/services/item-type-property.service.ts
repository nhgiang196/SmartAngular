import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
import { async } from '@angular/core/testing';

const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`
@Injectable({ providedIn: 'root' })
export class ItemTypePropertyService {
  dataResource: any = {};
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

  findItemTypePropertyByItemTypeId = (id) => this.http.get(`${ApiUrl}/ItemTypeProperty/GetItemTypePropertyByItemTypeId?id=${id}`);

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

  getTest(dataSource, key) {
    function isNotEmpty(value: any): boolean {
      return value !== undefined && value !== null && value !== "";
    }
    let data;
    
    var dataSourceRes = new DataSource({
      key: key,
      //filter:  ["ItemTypeId","=",itemTypeId],
      load: (loadOptions) => {
        let params: HttpParams = new HttpParams();
        [
          "skip",
          "take",
          "requireTotalCount",
          "requireGroupCount",
          "sort",
          "filter",
          "totalSummary",
          "group",
          "groupSummary"
        ].forEach(function (i) {
          if (i in loadOptions && isNotEmpty(loadOptions[i]))
            params = params.set(i, JSON.stringify(loadOptions[i]));
        });
        return this.http.get(`${ApiUrl}/ItemType/DataGridItemTypePagination`, { params: params } )
          .toPromise()
          .then(result => {
            let res = result as any;
            data = res.data;
            this.dataResource = data;
            return {
              data: res.data,
              totalCount: res.totalCount,
              summary: res.summary,
              groupCount: res.groupCount
            };
          });
      },
      insert: function () {
        return null;
      },
      remove: function () {
          return null;
      },
      update: function () {
          return null;
      }
    });
   return dataSourceRes;
   
  }
}
