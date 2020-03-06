import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Renderer } from "@angular/core";
import { CustomerComponent } from '../customer/customer.component';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  // @ViewChild(ContractDirective) dtTracDirective :ContractDirective;

  constructor() { }

  ngOnInit() {
  }

}
  