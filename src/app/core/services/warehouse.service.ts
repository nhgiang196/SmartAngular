import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { Warehouse } from '../models/warehouse';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class WareHouseService extends GenericFactoryService<Warehouse>{
  constructor(http: HttpClient) {
    super(http,'Warehouse');
  }

  getPagination =(keyvalue, page, pageSize) => { 
    let pr = new DataTablePaginationParams();
    pr.key = keyvalue;
    pr.page = page<1? 1 : page;
    pr.pageSize = pageSize;
    return this.http.post<any>(`${ApiUrl}/Warehouse/GetWarehousePaginationByStored`,pr);
  };
}
