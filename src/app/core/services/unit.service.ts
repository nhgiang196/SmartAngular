import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyHelperService } from './my-helper.service';
import { Unit } from '../models/unit';
import { GenericFactoryService } from './general/generic-factory.service';
@Injectable({ providedIn: 'root' })
export class UnitService extends GenericFactoryService<Unit>{
  constructor(http: HttpClient) {
    super(http,Unit);
  }
}
