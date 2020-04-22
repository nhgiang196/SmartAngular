import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { DataTablesResponse } from "../models/datatable";
import { environment } from "src/environments/environment";
import { ProcessLog } from "../models/process";
import { GenericFactoryService } from "./general/generic-factory.service";
import DataSource from "devextreme/data/data_source";
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { MyHelperService } from "./utility/my-helper.service";
const ApiUrl = environment.apiUrl;
@Injectable({ providedIn: "root" })
export class ProcessLogService extends GenericFactoryService<ProcessLog> {
  constructor(http: HttpClient, private helper: MyHelperService) {
    super(http, "ProcessLog");
  }
  updateDefault = (entity) =>
    this.http.post(`${ApiUrl}/ProcessLog/UpdateProcessLog`, entity);
  findProcessLog = (factoryId, stageId, itemOutId, startDate, endDate) =>
    this.http.get<any>(`${ApiUrl}/ProcessLog/FindProcessLog`, {
      params: {
        factoryId: factoryId,
        stageId: stageId,
        itemOutId,
        startDate,
        endDate,
      },
    });
  searchProcessLog = (factoryid, endate) =>
    this.http.get<any>(`${ApiUrl}/ProcessLog/SearchProcessLog`, {
      params: { factoryid: factoryid, endDate: endate },
    });
  loadDxoGridProcessLog(factoryId, stageId, itemOutId, startDate, endDate) {
    let self = this;
    return new DataSource({
      store: AspNetData.createStore({
        key: "ProcessLogId",
        loadUrl: `${ApiUrl}/ProcessLog/FindProcessLogs`,
        deleteUrl: `${ApiUrl}/ProcessLog/DeleteProcessLog`,
        insertUrl: `${ApiUrl}/ProcessLog/AddProcessLog`,
        updateUrl: `${ApiUrl}/ProcessLog/UpdateProcessLog`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
          ajaxOptions.data.keyId = "ProcessLogId";
          if (method == "insert") {
            if (ajaxOptions.data.values != null) {
              let entity = JSON.parse(ajaxOptions.data.values);
              ajaxOptions.data.values = entity;
              ajaxOptions.data = JSON.stringify(ajaxOptions.data);
            }

          }
          if (method == "update") {
            let entity = JSON.parse(ajaxOptions.data.values);
            entity.ProcessLogId = ajaxOptions.data.key;
            ajaxOptions.data.values = entity;
            ajaxOptions.data = JSON.stringify(ajaxOptions.data);
          }

          ajaxOptions.contentType = "application/json";
        },
        loadParams: {
          factoryId,
          stageId,
          itemOutId,
          startDate,
          endDate,
        },
      }),
      filter: ["Status", "=", "1"],
    });
  }
}
