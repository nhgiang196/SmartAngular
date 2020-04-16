import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse, DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { MonitorDescription, Monitor } from '../models/monitor';
import { GenericFactoryService } from './general/generic-factory.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
const ApiUrl = environment.apiUrl;
let monitorSources: MonitorDescription[] = [
  { value: "PH", name: "pH" },
  { value: "Tss", name: "TSS" },
  { value: "Q", name: "Q" },
  { value: "Color", name: "Color" },
  { value: "Amoni", name: "Amoni" }
];

@Injectable({ providedIn: 'root' })
export class  MonitorService extends GenericFactoryService<Monitor>{
  constructor(http: HttpClient) {
    super(http,'Monitor');
  }

  getChartMonitor() {
    let entity = "Monitor";
    return new DataSource({
      store: createStore({
        key: `${entity}Id`,
        loadUrl: `${ApiUrl}/${entity}/DataGrid${entity}Pagination`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = entity + "Id";
  }
      }),
      paginate: false,
      select: ["MonitorDate","PH","Tss","Q","Color","Amoni"],
      filter: ["FactoryId","=",0]

    });
  }

  addMonitor = (entity) => this.http.post(`${ApiUrl}/Monitor/AddMonitor`, entity);
  updateMonitor = (entity) => this.http.put(`${ApiUrl}/Monitor/UpdateMonitor`, entity)
  getDataTableMonitorPagination = (entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Monitor/DataTableMonitorPagination`, entity);
  deleteMonitor = (id) => this.http.delete(`${ApiUrl}/Monitor/DeleteMonitor`, { params: { id: id } });
  getMonitorPagination = (keySearch) => {
    let model = new DataTablePaginationParams();
    model = {
      key: keySearch,
      entity: "Monitor",
      keyFields: "",
      selectFields: "MonitorId,MonitorCode,MonitorName",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "MonitorName"
    };
    return this.http.post<any>(`${ApiUrl}/Monitor/GetMonitorPagination`, model, {})
  }
  getMonitor = () => this.http.get(`${ApiUrl}/Monitor/GetMonitor`);
  findMonitorById = (id) => this.http.get<any>(`${ApiUrl}/Monitor/FindMonitorById?id=${id}`);
  validateMonitor = (entity) => this.http.post(`${ApiUrl}/Monitor/ValidateStage`, entity);
  //  getChartByDate =(entity) => this.http.get(`${ApiUrl}/Monitor/QueryChartByDate?factoryId=${entity.factoryId}&dateFrom=${entity.dateFrom}&dateTo=${entity.dateTo}`)
  getChartByDate = (entity) => this.http.get(`${ApiUrl}/Monitor/QueryChartByDate${entity}` );
  getMonitorSources(): MonitorDescription[] {
    return monitorSources;
  }
}
