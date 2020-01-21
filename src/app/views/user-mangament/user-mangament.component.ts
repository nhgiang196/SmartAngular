import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../app.helpers';





@Component({
  selector: 'app-user-mangament',
  templateUrl: './user-mangament.component.html',
  styleUrls: ['./user-mangament.component.css']
})
export class UserMangamentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit(){
    collapseIboxHelper();
  }
  

}
