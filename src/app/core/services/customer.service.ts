import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class CustomerService {
  constructor(private http: HttpClient) {

  }

  addCustomer =(entity) => this.http.post(`${ApiUrl}/Customer/AddCustomer`,entity);
  updateCustomer =(entity) => this.http.put(`${ApiUrl}/Customer/UpdateCustomer`,entity);
  deleteCustomer =(id) => this.http.delete(`${ApiUrl}/Customer/DeleteCustomer`,{ params: { id: id } });
  getCustomerPagination =(entity) => this.http.post<any>(`${ApiUrl}/IteCustomerm/GetCustomerPagination`,entity,{} );
  getDataTableCustomerPagination =(entity) => { // Note: BA yêu cầu gửi Parram như thế này
    entity.KeyFields = `c.CustomerId, c.CustomerName, c.FactoryId	,c.CustomerAddress, c.ContactName, c.ContactEmail, c.ContactPhone, c.Description, c.CreateBy	, c.CreateDate, c.ModifyBy	, c.ModifyDate, c.Status	, c.IsIntergration`;
    entity.SelectFields = `
     c.*, FactoryName , [CustomerStatus] = dbo.GetDefine('CustomerStatus',c.Status) `;
    entity.Entity = `  Customer c LEFT JOIN Factory f ON f.FactoryId = c.FactoryId`;
    return this.http.post<DataTablesResponse>(`${ApiUrl}/Customer/DataTableCustomerPagination`,entity);}
  getCustomer =() => this.http.get(`${ApiUrl}/Customer/GetCustomer` );
  findCustomerById =(id) => this.http.get<any>(`${ApiUrl}/Customer/FindCustomerById?id=${id}` );
  validateCustomer =(entity) =>{ return this.http.post(`${ApiUrl}/Customer/ValidateCustomer`,entity);}
}
