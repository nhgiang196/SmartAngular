import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

const ApiUrl = environment.apiUrl;
const NULL_ROUTES = `${environment.apiUrl}/DevExtreme/NullRoutes`
@Injectable({providedIn: 'root'})
export class UnitService {
  constructor(private http: HttpClient) {

  }
  addUnit =(entity) => this.http.post(`${ApiUrl}/Unit/AddUnit`,entity);
  updateUnit =(entity) => this.http.put(`${ApiUrl}/Unit/UpdateUnit`,entity);
  deleteUnit =(id) => this.http.delete(`${ApiUrl}/Unit/DeleteUnit`,{ params: { id: id } });
  getUnitPagination =(keySearch) =>{
    let model : DataTablePaginationParams = {
      key: keySearch,
      entity: "Unit",
      keyFields: "",
      selectFields: "UnitName,UnitId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "UnitName"
    };
   return this.http.post<any>(`${ApiUrl}/Unit/GetUnitPagination`,model,{} )
  }
  getBasicUnit(){
    let pr = new DataTablePaginationParams();
    pr.selectFields = "UnitId, [UnitName]= IIF(ISNULL(UnitName,'')='',N'[Noname Unit]',UnitName), Status ";
    return this.http.post(`${ApiUrl}/Unit/GetUnitPagination`, pr);
  }
  getDataTableUnitPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Unit/DataTableUnitPagination`,entity);
  getUnitSelect2 =(keyword) => this.http.get<any>(`${ApiUrl}/Unit/GetUnitPaginationToSelect2?keyword=`+keyword );
  getUnit =() => this.http.get(`${ApiUrl}/Unit/GetUnit` );
  findUnitById =(id) => this.http.get<any>(`${ApiUrl}/Unit/FindUnitById?id=${id}` );
  validateUnit =(entity) =>{
    return this.http.post(`${ApiUrl}/Unit/ValidateUnit`,entity);
  }

  getDataGridUnit(dataSource,key){
     dataSource = AspNetData.createStore({
      key: key,
      loadUrl:`${ApiUrl}/Unit/DataGridUnitPagination`,
      insertUrl: NULL_ROUTES,
      updateUrl: NULL_ROUTES,
      deleteUrl: NULL_ROUTES,
      onBeforeSend: function(method, ajaxOptions) {
          ajaxOptions.data.key = key;
          ajaxOptions.xhrFields = { withCredentials: true };
      }
    });
    return dataSource;
  }


}
