import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class ContractService {
  constructor(private http: HttpClient) {

  }

  getContract =() => this.http.get(`${ApiUrl}/Contract/GetContract` );
  getContractByCustomer =(keyValue) =>  {
    let e = new DataTablePaginationParams();
    e.selectFields= ` * , [ContractTypeName] = dbo.GetDefine('ContractType',ContractType) `
    e.specialCondition = `CustomerId= ${keyValue}`;
    console.log('parrams send',e);
    return this.http.post<any>(`${ApiUrl}/Contract/GetContractPagination` ,e);
  }
  getContractPagination =(entity) => this.http.post<any>(`${ApiUrl}/Contract/GetContractPagination`,entity,{} );
  getDataTableContractPagination =(entity) => this.http.post<DataTablesResponse>(`${ApiUrl}/Item/DataTableContractPagination`,entity);
  findContractById =(id) => this.http.get<any>(`${ApiUrl}/Contract/FindContractById?id=${id}` );
  addContract =(entity) => this.http.post(`${ApiUrl}/Contract/AddContract`,entity);
  updateContract =(entity) => this.http.put(`${ApiUrl}/Contract/UpdateContract`,entity);
  deleteContract =(id) => this.http.delete(`${ApiUrl}/Contract/DeleteContract?id=${id}`);
  validateContract =(entity) => this.http.post(`${ApiUrl}/Contract/ValidateContract?`,entity);

}
