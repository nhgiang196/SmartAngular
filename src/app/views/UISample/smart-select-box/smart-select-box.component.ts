import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'smart-select-box',
  template: `<dx-select-box [dataSource]="dataSource"
              displayExpr="text"
              (onValueChanged)="onValueChanged($event)"
              [(value)]="selectData"
              [searchEnabled]="true"
              [searchExpr]="searchExpr"
              ></dx-select-box>`,
})
export class SmartSelectBoxComponent implements OnInit {
  dataSource: any;
  @Input('entitykey')  entityKey : string ;
  @Input('checkstatus')  checkStatus : boolean = false ;

  @Input()  selectData : number ; //binding  : D
  @Output() selectDataChange: EventEmitter<number> = new EventEmitter<number>();
  searchExpr: any;

  constructor() {
  }

  ngOnInit() {
    this.searchExpr = [this.entityKey + "Name"]
    let serviceUrl = `${environment.apiUrl}/${this.entityKey}/UI_SelectBox`;
    this.dataSource =  new DataSource({
      store: createStore({
          key: this.entityKey + "Id",
          loadUrl: serviceUrl,
          loadParams: {key: this.entityKey + "Id"}
      }) ,
      paginate: true,
      pageSize: 10,
      filter: this.checkStatus? ["Status", "=", 1] : [],
      map: (dataItem) => {
        dataItem.id =  dataItem[Object.keys(dataItem)[0]];
        dataItem.text =  (dataItem[this.entityKey+'Code']? dataItem[this.entityKey+'Code']+' - ': '' ) +  dataItem[Object.keys(dataItem)[1]];
        return dataItem;
      }

    });
    this.dataSource.load();

  }

  onValueChanged(event){
    this.selectDataChange.emit(event.value.id || event.value || 0);
  }



}
