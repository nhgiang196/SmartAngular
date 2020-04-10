import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { ProcessLog } from '../models/process';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;
@Injectable({providedIn: 'root'})
export class ProcessLogService extends GenericFactoryService<ProcessLog>{
  constructor(http: HttpClient) {
    super(http,'ProcessLog');
  }
  findProcessLog =(factoryId,stageId,itemOutId) => this.http.get<any>(`${ApiUrl}/ProcessLog/FindProcessLog`,{ params: { factoryId: factoryId ,stageId:stageId,itemOutId}});
  searchProcessLog =(factoryid,endate) => this.http.get<any>(`${ApiUrl}/ProcessLog/SearchProcessLog`,{ params: { factoryid: factoryid , endDate : endate} });
}
