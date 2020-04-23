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
  { value: "PH", name: "pH", color:'#1DB2F5'},
  { value: "Tss", name: "TSS", color: '#EB3573' },
  { value: "Q", name: "Q", color: '#97C95C' },
  { value: "Color", name: "Color", color: '#F5564A' },
  { value: "Amoni", name: "Amoni", color: '#A63DB8' },
  { value: "Cod", name: "COD", color: '#F5564A' },
  { value: "Temperature", name: "Temperature", color: '#A63DB8' }
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
      select: ["MonitorDate","PH","Tss","Q","Color","Amoni","Cod","Temperature"],
      filter: ["FactoryId","=",0],
      map: (data)=>{
        var _returnData = [];
        this.getMonitorSources().forEach((e)=>{
          data['data_'+e.value] = [new Date(data['MonitorDate']).valueOf() ,data[e.value]]
        })
        return data;
      }

    });
  }
  // ["MonitorDate","PH","Tss","Q","Color","Amoni"]

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

  //test get all only month
  getAll =()=> this.http.get<Monitor[]>(`${ApiUrl}/Monitor/GetAll`);
}
