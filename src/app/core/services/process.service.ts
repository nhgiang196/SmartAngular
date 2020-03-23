import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class ProcessService {
  constructor(private http: HttpClient) {

  }

  getProcessLogPagination =(entity) => this.http.post<any>(`${ApiUrl}/ProcessLog/GetProcessLogPagination`,entity,{} );
  getDataTableProcessLogPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableProcessLogPagination`,entity);
  findProcessLogById =(id) => this.http.get<any>(`${ApiUrl}/ProcessLog/FindProcessLogById?id=${id}` );
  findProcessLogByFactoryId =(id,endDate) => this.http.get<any>(`${ApiUrl}/ProcessLog/FindProcessLogByFactoryId?id=${id}&endDate=${endDate}` );
  addProcessLog =(entity) => this.http.post(`${ApiUrl}/ProcessLog/AddProcessLog`,entity);
  updateProcessLog =(entity) => this.http.put(`${ApiUrl}/ProcessLog/UpdateProcessLog`,entity);
  deleteProcessLog =(id) => this.http.delete(`${ApiUrl}/ProcessLog/DeleteProcessLog?id=${id}`);
  validateProcessLog =(entity) => this.http.post(`${ApiUrl}/ProcessLog/ValidateProcessLog?`,entity);

  searchProcessLog =(factoryid,endate) => this.http.get<any>(`${ApiUrl}/ProcessLog/SearchProcessLog`,{ params: { factoryid: factoryid , endate : endate} });
}
