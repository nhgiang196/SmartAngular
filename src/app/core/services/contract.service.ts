import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablePaginationParams, DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import { Contract } from '../models/contrack';
import { GenericFactoryService } from './general/generic-factory.service';
const ApiUrl = environment.apiUrl;;
@Injectable({providedIn: 'root'})
export class ContractService extends GenericFactoryService<Contract>{
  constructor(http: HttpClient) {
    super(http,Contract);
  }
}
