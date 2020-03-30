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
  @Output() selectDataChange: EventEmitter<number> = new EventEmitter<number>();
  searchExpr: any;

<<<<<<< HEAD
  constructor() {


=======
  constructor() { 
    
>>>>>>> f8225ddba2e008f1f38c5188ed26351c713a1da3
  }

  ngOnInit() {
    this.searchExpr = [this.entityKey + "Code", this.entityKey + "Name"]
    let serviceUrl = `${environment.apiUrl}/${this.entityKey}/${this.entityKey}SelectBox`;
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
    console.log('Got event',event)
    this.selectDataChange.emit(event.value.id || event.value || 0);
  }



}
