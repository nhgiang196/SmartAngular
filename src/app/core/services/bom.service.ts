import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { BomFactory } from '../models/bom';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;
@Injectable({providedIn: 'root'})
export class BomService  extends GenericFactoryService<BomFactory> {
  constructor(http: HttpClient) {
    super(http,BomFactory);
  }

   getAllUnitByItemId =(id) => this.http.get<any>(`${ApiUrl}/BomFactory/GetAllUnitByItemId?id=${id}` );

}
