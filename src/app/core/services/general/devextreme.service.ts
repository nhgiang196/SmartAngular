import { Injectable } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class DevextremeService {

  constructor(private http: HttpClient) { }

  loadDxoGrid(entity, actionLoad = "", actionDelete = "", actionInsert = "", actionUpdate = "", checkStatus = true) {
    return new DataSource({
      store: AspNetData.createStore({
        key: entity + "Id",
        loadUrl: `${ApiUrl}/${entity}/${actionLoad}`,
        deleteUrl: `${ApiUrl}/${entity}/${actionDelete}`,
        updateUrl: `${ApiUrl}/${entity}/${actionUpdate}`,
        insertUrl: `${ApiUrl}/${entity}/${actionInsert}`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = entity + "Id";
        }
      }),
      filter: checkStatus ? ["Status", "=", "1"] : []
    });
  }

  loadDxoGridCustomStore(entity, cbLoad, cbInsert, cbUpdate, cbRemove) {
    return new CustomStore({
      key: entity + "Id",
      load: () => cbLoad(),
      insert: (values) => cbInsert(values),
      update: (key, values) => cbUpdate(values),
      remove: (key) => cbRemove(key),
    });
  }

  loadDxoLookup(entity, checkStatus = true) {
    return {
      store: createStore({
        key: entity + "Id",
        loadUrl: `${ApiUrl}/${entity}/UI_SelectBox`,
      }),
      paginate: true,
      pageSize: 10,
      filter: checkStatus ? ["Status", "=", 1] : []
    }
  }

  loadDxoLookupFilter(entity, filter = []) {
    return {
      store: createStore({
        key: entity + "Id",
        loadUrl: `${ApiUrl}/${entity}/UI_SelectBox`,
      }),
      paginate: true,
      pageSize: 10,
      filter:filter
    }
  }

  loadDefineLookup(columnName, checkStatus = false){
    return {
      store: createStore({
        loadUrl: `${ApiUrl}/Define/GetDefineDxLookup`,
      }),
      paginate: true,
      pageSize: 10,
      filter: checkStatus ? ["Status", "=", 1] : []
    }

  }
}
