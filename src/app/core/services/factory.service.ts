import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { createStore } from 'devextreme-aspnet-data-nojquery';
// import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
const ApiUrl = environment.apiUrl;;

export class ChartFactory {
	FactoryID: number;
	DateFrom: string;
	DateTo: string;
}
@Injectable({ providedIn: 'root' })
export class FactoryService {
  constructor(private http: HttpClient) {

  }

  getFactory() {
    return this.http.get<any>(`${ApiUrl}/Factory/GetFactory`);
  }
  getBasicFactory() {
    let pr = new DataTablePaginationParams();
    pr.selectFields = "FactoryId, [FactoryName]= IIF(ISNULL(FactoryName,'')='',N'[Noname factory]',FactoryName), Status ";
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, pr);
  }

  getFactoryPaginationMain(keyvalue, pageIndex, pageSize) {
    let pr = new DataTablePaginationParams();
    pr.key = keyvalue;
    pr.page = pageIndex < 1 ? 1 : pageIndex;
    pr.pageSize = pageSize;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPaginationPageIndex`, pr);
  }
  getFactoryPagination(keyvalue) {
    let pr = new DataTablePaginationParams();
    pr.keyFields = "FactoryName ,FactoryAddress,FactoryContact,ContactPhone"
    pr.key = keyvalue;

    pr.pageSize = 9999;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, pr);
  }

  loadFactorySelectBox(key) {
    return  new DataSource({
      store:createStore({
        key: key,
        loadUrl: `${ApiUrl}/Factory/GetFactoryDataGridPagination`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = key;
       }
      })
    });
  }

  getAllFactoryPagination(model) {
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPagination`, model);
  }

  getFactoryToSelect2 = (keyword) => this.http.get<any>(`${ApiUrl}/Factory/GetFactoryPaginationToSelect2?keyword=` + keyword);

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
  validateFactory(e) {
    return this.http.post(`${ApiUrl}/Factory/ValidateFactory`, e);
  }

}
