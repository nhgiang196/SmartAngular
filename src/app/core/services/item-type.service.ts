import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from 'devextreme/data/custom_store';
import { StageService } from './stage.service';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { GenericFactoryService } from './general/generic-factory.service';
import { ItemType } from '../models/item';

const ApiUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ItemTypeService extends GenericFactoryService<ItemType> {
  constructor(http: HttpClient) 
  { 
    super(http,'ItemType');
  }

  checkForeignKey(itemTypeProperty){
    return this.http.post(`${ApiUrl}/ItemType/checkForeignKey`, itemTypeProperty).toPromise();
  }
 
}
