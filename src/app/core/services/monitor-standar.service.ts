import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MonitorStandard } from '../models/monitor';
import { DataTablePaginationParams } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
import { GenericFactoryService } from './general/generic-factory.service';
@Injectable({providedIn: 'root'})
export class MonitorStandarService extends GenericFactoryService<MonitorStandard> {
  constructor(http: HttpClient) {
    super(http,'MonitorStandard');
  }
}
