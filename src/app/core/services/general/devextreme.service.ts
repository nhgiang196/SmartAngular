import { Injectable } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
import { TranslateService } from '@ngx-translate/core';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class DevextremeService {

  constructor(private http: HttpClient, private trans: TranslateService) { }

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

  loadDefineDisplayExpr(){
    return "Description"+(this.trans.currentLang == 'en'? 'En' : 'Vn');
  }
  loadDefineLookup(columnName, checkStatus = false){
    let basicFilter = ["ColumName","=",columnName]
    return  {
      store: createStore({
        key: "Id",
        loadUrl: `${ApiUrl}/Define/GetDefineDxLookup`,
      }),
      filter: checkStatus ? [["State", "=", true],"and",basicFilter] : basicFilter,
      map: (dataItem) => {
        debugger;
        dataItem.Id = isNaN(dataItem.Id)? dataItem.Id : parseInt(dataItem.Id)
        return dataItem;
      }
    }
  }

  loadDefineSelectBox(columnName, checkStatus = false){
    let basicFilter = ["ColumName","=",columnName]
    return new DataSource( {
      store: createStore({
        key: "Id",
        loadUrl: `${ApiUrl}/Define/GetDefineDxLookup`,
      }),
      filter: checkStatus ? [["State", "=", true],"and",basicFilter] : basicFilter,
      map: (dataItem) => {
        debugger;
        dataItem.Id = isNaN(dataItem.Id)? dataItem.Id : parseInt(dataItem.Id)
        return dataItem;
      }
    })
  }





}
