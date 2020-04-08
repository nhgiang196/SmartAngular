import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { createStore } from 'devextreme-aspnet-data-nojquery';
// import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
import { Factory } from '../models/factory';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;;

@Injectable({ providedIn: 'root' })
export class FactoryService extends GenericFactoryService<Factory> {
  constructor(http: HttpClient) {
    super(http, 'Factory');
  }
  getFactoryPaginationMain(keyvalue, pageIndex, pageSize) {
    let pr = new DataTablePaginationParams();
    pr.key = keyvalue;
    pr.page = pageIndex < 1 ? 1 : pageIndex;
    pr.pageSize = pageSize;
    return this.http.post(`${ApiUrl}/Factory/GetFactoryPaginationPageIndex`, pr);
  }
  loadFactorySelectBox(key) {
    return  new DataSource({
      store:createStore({
        key: key,
        loadUrl: `${ApiUrl}/Factory/GetFactoryDataGridPagination`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = key;
       }
      })
    });
  }


}
