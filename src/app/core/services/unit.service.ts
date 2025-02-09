import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyHelperService } from './utility/my-helper.service';
import { Unit } from '../models/unit';
import { GenericFactoryService } from './general/generic-factory.service';
import { environment } from 'src/environments/environment';
const ApiUrl = environment.apiUrl;
@Injectable({ providedIn: 'root' })
export class UnitService extends GenericFactoryService<Unit>{
  constructor(http: HttpClient) {
    super(http,'Unit');
  }
  getAllUnitByItemId =(id) => this.http.get<any>(`${ApiUrl}/Unit/GetAllUnitByItemId?id=${id}` );
}
