import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
import { Item } from '../models/item';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;;
@Injectable({ providedIn: 'root' })
export class ItemService extends GenericFactoryService<Item> {
  constructor(http: HttpClient) {
    super(http,Item);
  }
  checkItemNameExist = (itemName) => this.http.get<any>(`${ApiUrl}/Item/CheckItemNameExist?ItemName=${itemName}`);
}
