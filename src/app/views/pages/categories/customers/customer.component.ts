
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
declare let $: any;
import swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements  OnInit {
  iboxloading = false;
  selectData = 2;
  constructor(

  ) { 
  }
  ngOnInit() {

  }



}

