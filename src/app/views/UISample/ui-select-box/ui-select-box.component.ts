import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ui-select-box',
  templateUrl: './ui-select-box.component.html',
  styleUrls: ['./ui-select-box.component.css']
})
export class UISelectBoxComponent implements OnInit {
  dataSource: any;
  @Input('entitykey')  entityKey : string ;
  @Input('pageSize')  pageSize : number = 10 ;
  @Input('ngModelCustom')  ngModelCustom : any =null;
  @Input('checkstatus')  checkStatus : boolean = false ;
  @Input('disabled')  disabled : boolean = false ;

  @Output() ngModelCustomChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    let serviceUrl = `${environment.apiUrl}/${this.entityKey}/UI_SelectBox`;
    this.dataSource =  new DataSource({
      store: createStore({
          key: this.entityKey + "Id",
          loadUrl: serviceUrl,
      }) ,
      paginate: true,
      pageSize: this.pageSize,
      filter: this.checkStatus? ["Status", "=", 1] : [],
    });
  }

  getFilter(){
  }

  onValueChanged(event){
    this.ngModelCustomChange.emit(event.value);
    this.valueChange.emit(event.value);
  }



}
