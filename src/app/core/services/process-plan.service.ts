import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import CustomStore from 'devextreme/data/custom_store';
import { MyHelperService } from './my-helper.service';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ProcessPlanFactoryService {
  constructor(private http: HttpClient, private helper: MyHelperService) {}

  findProcessPlanFactoryById =(id) => this.http.get<any>(`${ApiUrl}/ProcessPlanFactory/FindProcessPlanFactoryById?id=${id}` );
  findProcessPlanFactoryByFactoryId =(id,endDate) => this.http.get<any>(`${ApiUrl}/ProcessPlanFactory/FindProcessPlanFactoryByFactoryId?id=${id}&endDate=${endDate}` );
  addProcessPlanFactory =(entity) => this.http.post(`${ApiUrl}/ProcessPlanFactory/AddProcessPlanFactory`,entity);
  updateProcessPlanFactory =(entity) => this.http.put(`${ApiUrl}/ProcessPlanFactory/UpdateProcessPlanFactory`,entity);
  deleteProcessPlanFactory =(id) => this.http.delete(`${ApiUrl}/ProcessPlanFactory/DeleteProcessPlanFactory?id=${id}`);
  validateProcessPlanFactory =(entity) =>  this.http.post(`${ApiUrl}/ProcessPlanFactory/ValidateProcessPlanFactory?`,entity);
  getBomStageNearestByFactoryId=(params)=>this.http.get<any>(`${ApiUrl}/ProcessPlanFactory/GetBomStageNearestByFactoryId`,{ params: params});
}
