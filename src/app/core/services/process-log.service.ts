import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { ProcessLog } from '../models/process';
import { GenericFactoryService } from './general/generic-factory.service';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
const ApiUrl = environment.apiUrl;
@Injectable({providedIn: 'root'})
export class ProcessLogService extends GenericFactoryService<ProcessLog>{
  constructor(http: HttpClient) {
    super(http,'ProcessLog');
  }
  updateDefault =(entity) => this.http.post(`${ApiUrl}/ProcessLog/UpdateProcessLog`, entity);
  findProcessLog =(factoryId,stageId,itemOutId,startDate,endDate) => this.http.get<any>(`${ApiUrl}/ProcessLog/FindProcessLog`,{ params: { factoryId: factoryId ,stageId:stageId,itemOutId,startDate,endDate}});
  searchProcessLog =(factoryid,endate) => this.http.get<any>(`${ApiUrl}/ProcessLog/SearchProcessLog`,{ params: { factoryid: factoryid , endDate : endate} });
  loadDxoGridProcessLog(factoryId,stageId,itemOutId,startDate,endDate){
    return new DataSource({
       store:AspNetData.createStore({
         key: "ProcessLogId",
         loadUrl: `${ApiUrl}/ProcessLog/FindProcessLogs`,
        //  deleteUrl:`${ApiUrl}/${entity}/${actionDelete}`,
          updateUrl:`${ApiUrl}/ProcessLog/Update`,
        //  insertUrl:`${ApiUrl}/${entity}/${actionInsert}`,
         onBeforeSend: function (method, ajaxOptions) {
           ajaxOptions.data.keyId ="ProcessLogId";
        },
        loadParams:{
          factoryId,
          stageId,
          itemOutId,
          startDate,
          endDate
        }
       }),
       filter:["Status","=","1"]
     });
   }
}
