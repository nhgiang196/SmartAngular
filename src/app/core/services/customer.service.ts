import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';

const ApiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class CustomerService {
  constructor(private http: HttpClient) {

  }

  addCustomer =(entity) => this.http.post(`${ApiUrl}/Customer/AddCustomer`,entity);
  updateCustomer =(entity) => this.http.put(`${ApiUrl}/Customer/UpdateCustomer`,entity);
  deleteCustomer =(id) => this.http.delete(`${ApiUrl}/Customer/DeleteCustomer`,{ params: { id: id } });
  getCustomerPagination =(entity) => this.http.post<any>(`${ApiUrl}/IteCustomerm/GetCustomerPagination`,entity,{} );
  getCustomer =() => this.http.get(`${ApiUrl}/Customer/GetCustomer` );
  findCustomerById =(id) => this.http.get<any>(`${ApiUrl}/Customer/FindCustomerById?id=${id}` );
  validateCustomer =(entity) =>{ return this.http.post(`${ApiUrl}/Customer/ValidateCustomer`,entity);}

  getDataGrid() {
    var dataSource = new DataSource({
      store: AspNetData.createStore({
          loadUrl: `${ApiUrl}/Customer/GetCustomerDataGridPagination`,
      }) ,
      paginate: true,
      pageSize: 10,
      })
      return dataSource;
  }


}
