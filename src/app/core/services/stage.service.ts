import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataTablesResponse, DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { formatDate } from '@angular/common';
import CustomStore from 'devextreme/data/custom_store';
import { MyHelperService } from './my-helper.service';
import { GenericFactoryService } from './general/generic-factory.service';
import { Stage } from '../models/stage';
const ApiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class StageService extends GenericFactoryService<Stage> {
  constructor(http:HttpClient) {
    super(http, 'Stage');
  }
}
