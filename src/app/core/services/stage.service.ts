import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTablesResponse, DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { formatDate } from '@angular/common';
import CustomStore from 'devextreme/data/custom_store';
import { MyHelperService } from './my-helper.service';
const ApiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class StageService {
  constructor(private http: HttpClient, private helper: MyHelperService) {

  }
  addStage = (entity) => this.http.post(`${ApiUrl}/Stage/AddStage`, entity);
  updateStage = (entity) => this.http.put(`${ApiUrl}/Stage/UpdateStage`, entity);
  getDataTableStagePagination = (entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Stage/DataTableStagePagination`, entity);
  deleteStage = (id) => this.http.delete(`${ApiUrl}/Stage/DeleteStage`, { params: { id: id } });
  getStagePagination = (keySearch) => {
    let model = new DataTablePaginationParams();
    model = {
      key: keySearch,
      entity: "Stage",
      keyFields: "",
      selectFields: "StageId,StageCode,StageName,Status",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "StageName"
    };
    return this.http.post<any>(`${ApiUrl}/Stage/GetStagePagination`, model, {})
  }
  getStage = () => this.http.get(`${ApiUrl}/Stage/GetStage`);
  findStageById = (id) => this.http.get<any>(`${ApiUrl}/Stage/FindStageById?id=${id}`);
  validateStage = (entity) => this.http.post(`${ApiUrl}/Stage/ValidateStage`, entity);

  // getDataGridStage(key, stageFiles) {
  //   console.log(stageFiles);
  //   return new DataSource({
  //     store: AspNetData.createStore({
  //       key: key,
  //       loadUrl: `${ApiUrl}/Stage/GetStageDataGridPagination`,
  //       updateUrl: `${ApiUrl}/Stage/UpdateStage`,
  //       deleteUrl: `${ApiUrl}/Stage/DeleteStage`,
  //       onBeforeSend: function (method, ajaxOptions) {
  //         ajaxOptions.data.keyId = key;
  //       }
  //     })
  //   });
  // }
  getDataGridStage() {
    return new CustomStore({
      key: "StageId",
      load: () => this.helper.sendRequest(ApiUrl + "/Stage/GetStageDataGridPagination"),
      insert: (values) => this.addStage(values).toPromise(),
      update: (key, values) => {
        console.log(values);
        return this.updateStage(values).toPromise()
      },
      remove: (key) => this.deleteStage(key).toPromise().then()
    });
  }
 

}
