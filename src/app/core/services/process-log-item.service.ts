import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { ProcessLogItem } from '../models/process';
import { GenericFactoryService } from './general/generic-factory.service';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
const ApiUrl = environment.apiUrl;
@Injectable({providedIn: 'root'})
export class ProcessLogItemService extends GenericFactoryService<ProcessLogItem>{
  constructor(http: HttpClient) {
    super(http,'ProcessLogItem');
  }
  updateDefault =(entity) => this.http.post(`${ApiUrl}/ProcessLogItem/UpdateProcessLogItem`, entity);
}
