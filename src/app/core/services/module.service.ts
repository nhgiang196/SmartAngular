import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Module } from '../models/module';
const ApiUrl = environment.apiUrl;;
@Injectable({
  providedIn: 'root'
})
export class ModuleService {

constructor(private http: HttpClient) { }

getAllModule= ()=> this.http.get<Module[]>(`${ApiUrl}/Module/GetAll`);

}
