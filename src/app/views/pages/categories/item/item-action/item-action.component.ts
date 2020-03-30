import { Component, OnInit } from '@angular/core';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Item, ItemFactory, ItemProperty, ItemPackage, ItemFile, ItemType } from 'src/app/core/models/item';
import { Subject } from 'rxjs';
import { UnitService } from 'src/app/core/services';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import swal from "sweetalert2";

@Component({
  selector: 'app-item-action',
  templateUrl: './item-action.component.html',
  styleUrls: ['./item-action.component.css']
})
export class ItemActionComponent implements OnInit {
  entity: Item = new Item();
  dataSourceItemFactory:any;
  dataSourceFactory:any;

  //set rowEdit
  editRowId: number = 0;
  constructor(private unitService:UnitService,private route: ActivatedRoute) { }

  ngOnInit() {
    var item = this.route.snapshot.data["item"] as Item;
    if (item != null) {
      this.entity = item;
    }
    this.loadFactorySelectBox();
  }

  fnSave(){
    console.log(this.entity);
  }

  ///Area Unit////

  ///Area Factory////
  onRowUpdating(event){
    if(this.entity.ItemFactory.find(x=>x.FactoryId == event.newData.FactoryId)){
      swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
      this.dataSourceFactory.load();
      return false;
    }
  }
  loadFactorySelectBox(){
    let keyId = "FactoryId";

    this.dataSourceFactory =  createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/Factory/UI_SelectBox`,
      loadParams:{keyId:keyId},
      onBeforeSend:function (method, ajaxOptions) {
        ajaxOptions.data.keyId = keyId;
        if(ajaxOptions.data.filter!=null){

          let dataParse = JSON.parse(ajaxOptions.data.filter);
          if (dataParse.length == 2)
              dataParse =JSON.parse(JSON.stringify([dataParse]));
            dataParse.push('and');
            dataParse.push(["Status","=",1]);
            ajaxOptions.data.filter = JSON.stringify(dataParse);
        }
        else{
          ajaxOptions.data.filter =JSON.stringify(["Status","=",1]) ;
        }
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

}
