import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Observable } from 'rxjs';

import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { DxDataGridModule } from 'devextreme-angular';


const ApiUrl = environment.apiUrl;
export class GenericFactoryService<T> implements IGenericFactoryService<T> {
  private entity: string;
  requests: string[] = [];
  constructor(public http: HttpClient, entity: string) {
    this.entity = entity;

  }
  getAll() {
    return this.http.get<any>(`${ApiUrl}/${this.entity}/Get${this.entity}`);
  }
  getSelectBox(checkStatus = false, showText = '') {
    return new DataSource({
      store: createStore({
        key: `${this.entity}Id`,
        loadUrl: `${ApiUrl}/${this.entity}/UI_SelectBox`,
        loadParams: { key: `${this.entity}Id` }
      }),
      paginate: true,
      pageSize: 10,
      filter: checkStatus ? ["Status", "=", 1] : [],
      map: (dataItem) => {
        dataItem.id = dataItem[Object.keys(dataItem)[0]];
        dataItem.text = (dataItem[showText] ? dataItem[showText] + ' - ' : '') + dataItem[Object.keys(dataItem)[1]];
        return dataItem;
      }
    });
  }
  validate(entity): Promise<T> {
    return this.http.post<T>(`${ApiUrl}/${this.entity}/Validate${this.entity}`, entity).toPromise();
  }
  validateCode(entity): Promise<T> {
    return this.http.post<T>(`${ApiUrl}/${this.entity}/ValidateCode${this.entity}`, entity).toPromise();
  }

  getDxoLookup(checkStatus = true) {
    return {
      store: createStore({
        key: this.entity + "Id",
        loadUrl: `${ApiUrl}/${this.entity}/UI_SelectBox`,
      }),
      paginate: true,
      pageSize: 10,
      filter: checkStatus ? ["Status", "=", 1] : []
    }
  }
  getDataGridUrl(actionLoad = "", actionDelete = "", actionInsert = "", actionUpdate = "", checkStatus = true) {
    let entity = this.entity;
    return new DataSource({
      store: createStore({
        key: `${this.entity}Id`,
        loadUrl: `${ApiUrl}/${this.entity}/${actionLoad}`,
        deleteUrl: `${ApiUrl}/${this.entity}/${actionDelete}`,
        updateUrl: `${ApiUrl}/${this.entity}/${actionUpdate}`,
        insertUrl: `${ApiUrl}/${this.entity}/${actionInsert}`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = `${entity}Id`;
        }
      }),
      filter: checkStatus ? ["Status", "=", "1"] : ""
    });
  }
  getDataGridWithOutUrl(checkStatus: boolean = true) {
    let entity = this.entity;
    return new DataSource({
      store: createStore({
        key: `${this.entity}Id`,
        loadUrl: `${ApiUrl}/${this.entity}/DataGrid${this.entity}Pagination`,
        deleteUrl: `${ApiUrl}/${this.entity}/Delete${this.entity}`,
        updateUrl: `${ApiUrl}/${this.entity}/Update${this.entity}`,
        insertUrl: `${ApiUrl}/${this.entity}/Add${this.entity}`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = entity + "Id";
        }
      }),
      filter: checkStatus ? ["Status", "=", "1"] : ""
    });
  }
  findById(id: any): Observable<T> {
    return this.http.get<T>(`${ApiUrl}/${this.entity}/Find${this.entity}ById`, { params: { id: id } });
  }

  getDataGrid(checkStatus = false) {
    let self = this;
    return new DataSource({
      store: new CustomStore({
        key: `${this.entity}Id`,
        load: (loadOptions) => {
          function isNotEmpty(value: any): boolean {
            return value !== undefined && value !== null && value !== "";
          }
          let params: HttpParams = new HttpParams();
          [
            "skip",
            "take",
            "requireTotalCount",
            "requireGroupCount",
            "sort",
            "filter",
            "totalSummary",
            "group",
            "groupSummary"
          ].forEach(function (i) {
            if (i in loadOptions && isNotEmpty(loadOptions[i]))
              params = params.set(i, JSON.stringify(loadOptions[i]));
          });
          return this.http.get<any>(`${ApiUrl}/${self.entity}/DataGrid${self.entity}Pagination`, { params: params })
            .toPromise()
            .then(result => {
              return {
                data: result.data,
                totalCount: result.totalCount,
                summary: result.summary,
                groupCount: result.groupCount
              };
            });
        },
        insert: (values) => this.add(values),
        update: (key, values) => this.update(values),
        remove: (key) => this.remove(key).then(),

      }),
      filter: checkStatus ? ["Status", "=", "1"] : ""

    })
  }


  add(entity): Promise<T> {
    return this.http.post<T>(`${ApiUrl}/${this.entity}/Add${this.entity}`, entity).toPromise();
  }
  update(entity): Promise<T> {
    return this.http.put<T>(`${ApiUrl}/${this.entity}/Update${this.entity}`, entity).toPromise();
  }
  remove(id: any): Promise<T> {
    return this.http.delete<T>(`${ApiUrl}/${this.entity}/Delete${this.entity}`, { params: { id: id } }).toPromise();
  }


  /**
   * Sends request
   * @param url
   * @param [method] GET, POST, PUT, DELETE
   * @param [data] Return data
   * @returns request
   */

  private sendRequest(url: string, method: string = "GET", data: any = {}): any {
    this.logRequest(method, url, data);

    let httpParams = new HttpParams({ fromObject: data });
    let httpOptions = { withCredentials: true, body: httpParams };
    let result;

    switch (method) {
      case "GET":
        result = this.http.get(url, httpOptions);
        break;
      case "PUT":
        result = this.http.put(url, httpParams, httpOptions);
        break;
      case "POST":
        result = this.http.post(url, httpParams, httpOptions);
        break;
      case "DELETE":
        result = this.http.delete(url, httpOptions);
        break;
    }

    return result
      .toPromise()
      .then((data: any) => {
        //return method === "GET" ? data.data : data;
        return {
          data: data.items,
          totalCount: data.totalCount
        }
      })
      .catch(e => {
        throw e && e.error && e.error.Message;
      });
  }

  logRequest(method: string, url: string, data: object): void {
    var args = Object.keys(data || {}).map(function (key) {
      return key + "=" + data[key];
    }).join(" ");

    var time = new Date();

    this.requests.unshift([time, method, url.slice(URL.length), args].join(" "))
  }

  clearRequests() {
    this.requests = [];
  }
}
