import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MyHelperService } from '../my-helper.service';
import CustomStore from 'devextreme/data/custom_store';
import { type } from 'os';
import { identity } from 'rxjs';
const ApiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class GenericFactoryService<T> implements IGenericFactoryService<T> {
  private myIdentity : string;
  private http: HttpClient;
  private helper: MyHelperService;
  constructor(http: HttpClient, helper: MyHelperService,x : new () => T) {
    this.myIdentity = x.name;
    this.http = http;
    this.helper = helper;
   }
  validate(entity): Promise<T> {
    return this.http.post<T>(`${ApiUrl}/${this.myIdentity}/Validate${this.myIdentity}`, entity).toPromise();
  }
  getDataGrid() {
    return new CustomStore({
      key: `${this.myIdentity}Id`,
      load: () => this.load(),
      insert: (values) => this.add(values),
      update: (key, values) => this.update(values),
      remove: (key) => this.remove(key).then(),

    });
  }
  findById(id: any): Promise<T> {
    return this.http.get<T>(`${ApiUrl}/${this.myIdentity}/FindBy${this.myIdentity}Id`, { params: { id: id } }).toPromise();
  }
  add(entity): Promise<T> {
    return this.http.post<T>(`${ApiUrl}/${this.myIdentity}/Add${this.myIdentity}`, entity).toPromise();
  }
  update(entity): Promise<T> {
    return this.http.put<T>(`${ApiUrl}/${this.myIdentity}/Update${this.myIdentity}`, entity).toPromise();
  }
  remove(id: any): Promise<T> {
    return this.http.delete<T>(`${ApiUrl}/${this.myIdentity}/Delete${this.myIdentity}`, { params: { id: id } }).toPromise();
  }
  load() {
    return this.helper.sendRequest(`${ApiUrl}/${this.myIdentity}/DataGrid${this.myIdentity}Pagination`)
  }
}
