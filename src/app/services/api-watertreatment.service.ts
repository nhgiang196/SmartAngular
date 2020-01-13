import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const ApiUrl = "api/EMCS";


@Injectable({providedIn: 'root'})
export class WaterTreatmentService {
  constructor(
    private http: HttpClient,
  ) { }


  
}