import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse, DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class MonitorService {
  constructor(private http: HttpClient) {

  }

  addMonitor =(entity) => this.http.post(`${ApiUrl}/Monitor/AddMonitor`,entity);
   updateMonitor =(entity) => this.http.put(`${ApiUrl}/Monitor/UpdateMonitor`,entity);
   getDataTableMonitorPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Monitor/DataTableMonitorPagination`,entity);
   deleteMonitor =(id) => this.http.delete(`${ApiUrl}/Monitor/DeleteMonitor`,{ params: { id: id } });
   getMonitorPagination =(keySearch) => {
    let model = new DataTablePaginationParams();
    model= {
      key: keySearch,
      entity: "Monitor",
      keyFields: "",
      selectFields: "MonitorId,MonitorCode,MonitorName",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "MonitorName"
    };
    return this.http.post<any>(`${ApiUrl}/Monitor/GetMonitorPagination`,model,{} )
   }
   getMonitor =() => this.http.get(`${ApiUrl}/Monitor/GetMonitor` );
   findMonitorById =(id) => this.http.get<any>(`${ApiUrl}/Monitor/FindMonitorById?id=${id}` );
   validateMonitor =(entity) =>this.http.post(`${ApiUrl}/Monitor/ValidateStage`,entity);
}
