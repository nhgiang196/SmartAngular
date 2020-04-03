import { Injectable } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class DevextremeService {

constructor(private http: HttpClient) { }

loadDxoLookup(entity,checkStatus =true){
  return {
    store: createStore({
      key: entity + "Id",
      loadUrl: `${ApiUrl}/${entity}/UI_SelectBox`,
  }) ,
  paginate: true,
  pageSize: 10,
  filter: checkStatus?["Status", "=", 1]:[]
  }
}
}
