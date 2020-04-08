import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Observable } from 'rxjs';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class GenericFactoryService<T> implements IGenericFactoryService<T> {
  private entity: string;
  requests: string[] = [];
  constructor(public http: HttpClient,  x: new () => T) {
    this.entity = x.name;
  }
  getAll() {
    return this.http.get<any>(`${ApiUrl}/${this.entity}/Get${this.entity}`);
  }
  getSelectBox(checkStatus = false, showText='') {
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
  getDataGrid(checkStatus = false) {
    return new DataSource({
      store: new CustomStore({
        key: `${this.entity}Id`,
        load: () => this.load(),
        insert: (values) => this.add(values),
        update: (key, values) => this.update(values),
        remove: (key) => this.remove(key).then(),
      }),
     filter: checkStatus ? ["Status", "=", "1"] : ""
    })
  }
  getDataGridUrl(actionLoad = "", actionDelete = "", actionInsert = "", actionUpdate = "", checkStatus = true) {
    return new DataSource({
      store: createStore({
        key: `${this.entity}Id`,
        loadUrl: `${ApiUrl}/${this.entity}/${actionLoad}`,
        deleteUrl: `${ApiUrl}/${this.entity}/${actionDelete}`,
        updateUrl: `${ApiUrl}/${this.entity}/${actionUpdate}`,
        insertUrl: `${ApiUrl}/${this.entity}/${actionInsert}`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = this.entity + "Id";
        }
      }),
      filter: checkStatus ? ["Status", "=", "1"] : ""
    });
  }
  getDataGridWithOutUrl(checkStatus: boolean = true) {
    return new DataSource({
      store: createStore({
        key: `${this.entity}Id`,
        loadUrl: `${ApiUrl}/${this.entity}/DataGrid${this.entity}Pagination`,
        deleteUrl: `${ApiUrl}/${this.entity}/Delete${this.entity}`,
        updateUrl: `${ApiUrl}/${this.entity}/Update${this.entity}`,
        insertUrl: `${ApiUrl}/${this.entity}/Add${this.entity}`,
        onBeforeSend: function (method, ajaxOptions) {
          ajaxOptions.data.keyId = this.entity + "Id";
        }
      }),
      filter: checkStatus ? ["Status", "=", "1"] : ""
    });
  }
  findById(id: any):Observable<T> {
    return this.http.get<T>(`${ApiUrl}/${this.entity}/Find${this.entity}ById`, { params: { id: id } });
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
  load() {
    return this.sendRequest(`${ApiUrl}/${this.entity}/DataGrid${this.entity}Pagination`)
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
        return method === "GET" ? data.data : data;
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
