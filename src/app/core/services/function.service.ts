import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Module } from '../models/module';
const ApiUrl = environment.apiUrl;;
@Injectable({
  providedIn: 'root'
})
export class FunctionService {

constructor(private http: HttpClient) { }

getAllFuntion= ()=> this.http.get<Function[]>(`${ApiUrl}/Function/GetAll`);
getFuntionByModuleId= (id)=> this.http.get<Function[]>(`${ApiUrl}/Function/GetFunctionByModuleId?Id=${id}`);

}
