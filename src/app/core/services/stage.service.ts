import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse, DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class StageService {
  constructor(private http: HttpClient) {

  }
  addStage =(entity) => this.http.post(`${ApiUrl}/Stage/AddStage`,entity);
   updateStage =(entity) => this.http.put(`${ApiUrl}/Stage/UpdateStage`,entity);
   getDataTableStagePagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Stage/DataTableStagePagination`,entity);
   deleteStage =(id) => this.http.delete(`${ApiUrl}/Stage/DeleteStage`,{ params: { id: id } });
   getStagePagination =(keySearch) => {
    let model = new DataTablePaginationParams();
    model= {
      key: keySearch,
      entity: "Stage",
      keyFields: "",
      selectFields: "StageId,StageCode,StageName,Status",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "StageName"
    };
    return this.http.post<any>(`${ApiUrl}/Stage/GetStagePagination`,model,{} )
   }
   getStage =() => this.http.get(`${ApiUrl}/Stage/GetStage` );
   findStageById =(id) => this.http.get<any>(`${ApiUrl}/Stage/FindStageById?id=${id}` );
   validateStage =(entity) =>this.http.post(`${ApiUrl}/Stage/ValidateStage`,entity);
}
