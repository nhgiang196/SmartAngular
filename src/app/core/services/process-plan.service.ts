import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import CustomStore from 'devextreme/data/custom_store';
import { MyHelperService } from './my-helper.service';
import { GenericFactoryService } from './general/generic-factory.service';
import { ProcessPlanFactory } from '../models/process';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ProcessPlanFactoryService  extends GenericFactoryService<ProcessPlanFactory> {
  constructor(http: HttpClient) {
    super(http,ProcessPlanFactory);
  }

  findProcessPlanFactoryByFactoryId =(id,endDate) => this.http.get<any>(`${ApiUrl}/ProcessPlanFactory/FindProcessPlanFactoryByFactoryId?id=${id}&endDate=${endDate}` );

  getBomStageNearestByFactoryId=(params)=>this.http.get<any>(`${ApiUrl}/ProcessPlanFactory/GetBomStageNearestByFactoryId`,{ params: params});
}
