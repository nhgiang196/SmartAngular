import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OperationResult } from '../helpers/operationResult';

const ApiUrl='mongo-api'
@Injectable({
  providedIn: 'root'
})
export class MongoApiService {

  constructor(private http:HttpClient) { }
  
  createCollection(collection){
    return this.http.post<OperationResult>(`${ApiUrl}/createCollection`,collection);
  }
  //Get all by WorkFlowKey
  findCollection(voucherId){
    return this.http.put(`${ApiUrl}/findCollection`,voucherId);
  }
  //Delete one row by Id
  deleteOneItem(id){
    return this.http.post<OperationResult>(`${ApiUrl}/deleteOneCollection`,id);
  }
  deletManyCollection(processInstance){
    return this.http.post<OperationResult>(`${ApiUrl}/deleteManyCollection`,processInstance);
  }

}
