import { Component, OnInit, Input } from '@angular/core';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-smart-select-box',
  templateUrl: './smart-select-box.component.html',
  styleUrls: ['./smart-select-box.component.css']
})
export class SmartSelectBoxComponent implements OnInit {
  dataSource: any;
  entityKey : string = 'Warehouse';
  checkStatus : boolean = false;
  @Input() selectData : number = 14;
  constructor() { 
    let serviceUrl = `${environment.apiUrl}/${this.entityKey}/UI_SelectBox`;
    this.dataSource =  new DataSource({
      store: createStore({
          key: this.entityKey + "Id",
          loadUrl: serviceUrl,
      }) ,
      paginate: true,
      pageSize: 10,
      filter: this.checkStatus? ["Status", "=", 1] : [],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataSource.load();
  }

  onValueChanged(event){
    

  }

 
   
}
