
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer } from "@angular/core";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements  OnInit {
  iboxloading = false;
  constructor(
    
  ) { 
  }
  ngOnInit() {

  }


}

