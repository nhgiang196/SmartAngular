import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class WareHouseService {
  constructor(private http: HttpClient) {

  }

  getWarehousePagination =(keyvalue, page, pageSize) => { // Note: BA yêu cầu gửi Parram như thế này
    let pr = new DataTablePaginationParams();
    pr.keyFields="WarehouseCode,WarehouseName,WarehouseAddress,WarehouseType,WarehouseUserName,w.Status";
    pr.selectFields = " WarehouseId, WarehouseCode, WarehouseName, f.FactoryName, WarehouseType, WarehouseAddress, WarehouseUserName, u.NormalizedUserName , w.Status ";
    pr.entity = `Warehouse w LEFT JOIN [BCM_Auth].dbo.AspNetUsers u ON u.UserName= w.WarehouseUserName
                      LEFT JOIN Factory f ON f.FactoryId = w.FactoryId`;
    pr.key = keyvalue;
    pr.page = page<1? 1 : page;
    pr.pageSize = pageSize;
    return this.http.post<any>(`${ApiUrl}/Warehouse/GetWarehousePagination`,pr);
  };
  getWarehouse =() => this.http.get(`${ApiUrl}/Warehouse/GetWarehouse` );
  findWarehouseById =(id) => this.http.get<any>(`${ApiUrl}/Warehouse/FindWarehouseById?id=${id}` );
  addWarehouse =(entity) => this.http.post(`${ApiUrl}/Warehouse/AddWarehouse`,entity);
  updateWarehouse =(entity) => this.http.put(`${ApiUrl}/Warehouse/UpdateWarehouse`,entity);
  deleteWarehouse =(id) => this.http.delete(`${ApiUrl}/Warehouse/DeleteWarehouse?id=${id}`);
  validateWarehouse =(entity) => this.http.post(`${ApiUrl}/Warehouse/ValidateWarehouse?`,entity);
  validateWarehouseLocation =(entity) => this.http.post(`${ApiUrl}/Warehouse/ValidateWarehouseLocation?`,entity);
}
