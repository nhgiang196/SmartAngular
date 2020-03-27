import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'smart-select-box',
  templateUrl: './smart-select-box.component.html',
  styleUrls: ['./smart-select-box.component.css']
})
export class SmartSelectBoxComponent implements OnInit {
  dataSource: any;
  @Input('entitykey')  entityKey : string ;
  @Input('checkstatus')  checkStatus : boolean = false ;
 
  @Input()  selectData : number ; //binding  : D
  @Output() selectDataChange: EventEmitter<any> = new EventEmitter<any>();


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
      pageSize: 10,
      filter: this.checkStatus? ["Status", "=", 1] : [],
      map: (dataItem) => {
        dataItem.id =  dataItem[Object.keys(dataItem)[0]];
        dataItem.text =  dataItem[Object.keys(dataItem)[1]];
        return dataItem;
    }

    });
    this.dataSource.load();
    
  }

  onValueChanged(event){
    this.selectDataChange.emit(this.selectData);
  }

 
   
}
