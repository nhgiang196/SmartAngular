import { Component, OnInit } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {


    
  }

  ngAfterViewInit(){ //CSS
    collapseIboxHelper();
  }

}
