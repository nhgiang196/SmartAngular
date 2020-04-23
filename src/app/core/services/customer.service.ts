import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesResponse } from '../models/datatable';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import DataSource from 'devextreme/data/data_source';
import { GenericFactoryService } from './general/generic-factory.service';
import { Customer } from '../models/customer';

const ApiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class CustomerService extends GenericFactoryService<Customer>{
  constructor(http: HttpClient) {
    super(http,'Customer');
  }
}
