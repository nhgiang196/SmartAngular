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

  /** Hàm lấy phân trang cho page nhà máy bằng phương pháp index */
  getWarehousePaginationMain(keyvalue, pageIndex, pageSize) {
    let pr = new DataTablePaginationParams();
    pr.key = keyvalue;
    pr.page = pageIndex < 1 ? 1 : pageIndex;
    pr.pageSize = pageSize;
    return this.http.post(`${ApiUrl}/Warehouse/GetWarehousePaginationPageIndex`, pr);
  }

}
