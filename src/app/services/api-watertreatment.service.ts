import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const ApiUrl = "api/v1";


@Injectable({providedIn: 'root'})
export class WaterTreatmentService {
  constructor(
    private http: HttpClient,
  ) { }


  
}