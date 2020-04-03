import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MonitorStandard } from '../models/monitor';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`;
@Injectable({providedIn: 'root'})
export class MonitorStandarService {
  constructor(private http: HttpClient) {

  }

  getAllMonitorStandard= () => this.http.get<MonitorStandard[]>(`${ApiUrl}/MonitorStandard/GetMonitorStandard`);
  addMonitorStandard =(entity) => this.http.post(`${ApiUrl}/MonitorStandard/AddMonitorStandard`,entity);
  findMonitorStandardById =(id) => this.http.get<any>(`${ApiUrl}/MonitorStandard/FindMonitorStandardById?id=${id}` );
  deleteMonitorStandard =(id) => this.http.delete(`${ApiUrl}/MonitorStandard/DeleteMonitorStandard?id=${id}`);
  updateMonitorStandard =(entity) => this.http.put(`${ApiUrl}/MonitorStandard/UpdateMonitorStandard`,entity);
  validateMonitorStandard =(entity) => this.http.post(`${ApiUrl}/MonitorStandard/ValidateMonitorStandardByDate`,entity);

  getMonitorStandardPagination =(keyvalue) => {
    let pr = new DataTablePaginationParams();
    pr.keyFields="monitorstandardid, factoryName";
    pr.selectFields = "a.*, b.FactoryName";
    pr.entity = ` MonitorStandard a left join Factory b on a.FactoryId = b.FactoryId`;
    pr.key = keyvalue;
    pr.pageSize = 1;
    pr.orderDir = "asc";
    pr.orderBy = "MonitorStandardId";
    return this.http.post<any>(`${ApiUrl}/MonitorStandard/GetMonitorStandardPagination`,pr);
  };


  getDataTableMonitorStandardPagination =(entity) => {
    return this.http.post<any>(`${ApiUrl}/MonitorStandard/DataTableMonitorStandardPagination`,entity);
  };

  dataGridMonitorStandard = () => this.http.get(`${ApiUrl}/MonitorStandard/DataGridMonitorStandardPagination`);

  getDataGridMonitorStandard() {
    return new CustomStore({
      key: "MonitorStandardId",
      load: () => this.dataGridMonitorStandard().toPromise().then(),//this.stageService.sendRequest(ApiUrl + "/ItemType/DataGridItemTypePagination"),
      insert: (values) => this.addMonitorStandard(values).toPromise().then(),
      update: (key, values) =>  this.updateMonitorStandard(values).toPromise().then(), // no need key here
      remove: (key) =>  this.deleteMonitorStandard(key).toPromise().then()
    });
  }
  
  // getDataGridMonitorStandard(dataSource, key) {
  //   dataSource = AspNetData.createStore({
  //     key: key,
  //     loadUrl: `${ApiUrl}/MonitorStandard/DataGridMonitorStandardPagination`,
  //     insertUrl: NULL_ROUTES,
  //     updateUrl: NULL_ROUTES,
  //     deleteUrl: NULL_ROUTES,
  //     onBeforeSend: (method, ajaxOptions) => {
  //       ajaxOptions.data.key = key;
  //       ajaxOptions.xhrFields = { withCredentials: true };
  //     }
  //   });
  //   return dataSource;
  // }

}
