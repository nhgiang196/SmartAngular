import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemTypeService, AuthService, ItemTypePropertyService } from 'src/app/core/services';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import DataGrid from "devextreme/ui/data_grid";
import Swal from 'sweetalert2';
import { ItemTypeProperty, ItemType } from 'src/app/core/models/item';
import { HttpParams } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
import { async } from '@angular/core/testing';
import { element } from 'protractor';
@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSourceItemTypes: any;
  dataSourceProperties: any = {};
  itemTypeId : number =0;
  detail: ItemTypeProperty []= [];
  selectedRowIndex = -1;
  index = 999;
  isDisable: boolean;
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    //LOAD MSTER GRID
    this.dataSourceItemTypes = this.itemTypeService.getDataGridItemType(this.dataSourceItemTypes, 'ItemTypeId'); // default load
    
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }

//Load popup by propertyId
  async filterByItemTypeId(e){
    this.detail = (await this.itemTypePropertyService
      .findItemTypePropertyByItemTypeId(e.data.ItemTypeId)
      .toPromise()
      .then());
    this.isDisable = true;
    this.itemTypeId = e.data.ItemTypeId
    
    return this.detail;
  }

//Trigger for raise event update
  onEditorPreparing(e)
  {
      if (e.dataField == "ItemTypeName" && e.parentType === "dataRow") {
            e.setValue((e.value==null)?"":(e.value+"")); // Updates the cell value
    }
  }
 
/////MASTER////////////////////////
//Init
onInitNewRow(e) {
  this.detail = [];
  this.isDisable = false;
}
//Insert Master
 async onRowInsertingItemType(e){

  e.data.Status = 1;
  e.data.CreateBy = this.auth.currentUser.Username;
  e.data.CreateDate = new Date();
  e.data.ItemTypeId = 0;
  e.data.ItemTypeProperty=[];
  e.data.ItemTypeProperty = this.detail;// đây là khi lưu cha con nó lưu luôn
  e.data.ItemTypeProperty.forEach(element => {
    element.ItemTypePropertyId=0;
  });

  this.itemTypeService.addItemType(e.data).subscribe(res => {
    const result = res as any;
    if (result.Success) {
      this.toastr.success('Add success!', 'Success!');
      this.dataGrid.instance.refresh();
    } else {
      Swal.fire('Error!', result.Message, 'error');
    }
  });
}

//Update Master
async onRowUpdatingItemType(e) {
  
  const data = Object.assign(e.oldData, e.newData);

  data.ModifyBy = this.auth.currentUser.Username;
  data.ModifyDate = new Date();
  data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
  data.ItemTypeProperty = this.detail;// đây là khi lưu cha con nó lưu luôn
  data.ItemTypeProperty.forEach(element => {
    element.ItemTypePropertyId=0;
  });

  this.itemTypeService.updateItemType(data).subscribe(res => {
    const result = res as any;
    if (result.Success) {
      this.toastr.success('Update success!', 'Success!');
      this.dataGrid.instance.refresh();
    } else {
      Swal.fire('Error!', result.Message, 'error');
    }
  });
 
}

//Delete Master
onRowRemovingItemType(e) {
  this.itemTypeService.deleteItemType(e.data.ItemTypeId).subscribe(res => {
    const result = res as any;
    if (result.Success) {
      this.toastr.success('Delete success!', 'Success!');
      this.dataGrid.instance.refresh();
    } else {
      Swal.fire('Error!', result.Message, 'error');
    }
  });
}

////DETAIL/////////////////
//Insert Detail
  onInitNewRowDetail(e){
    e.data.ItemTypePropertyId = this.index++;
    e.data.ItemTypeId = this.itemTypeId;
    console.log(this.detail)
  }

  async onRowInsertingProperty(e)
  {
    //e.ItemTypePropertyId = 0;
    //this.detail = e.data as any;
    //this.ItemTypePropertyValidata(e)
    //console.log(this.detail)
  }
//Update Detail
  onRowUpdatingProperty(e)
  {
    console.log(this.detail)
  }

///Validate
async onValidateItemTypeName(e) {
  //return await this.itemTypeService.validateItemType(e).toPromise();
}
//Detail validata
detailValidation(property) {
  let isExsit = 0;
  this.detail.forEach(element =>{
    if(element.ItemTypePropertyName == property.data.ItemTypePropertyName 
      && element.ItemTypePropertyId != property.data.ItemTypePropertyId){
     isExsit ++
    }
  });
  if(isExsit>0) return false;
  else return true;
}

ItemTypePropertyValidata(property)
{ 
  
  
}
async onValidateItemTypeProperty(e) {
  return await this.itemTypePropertyService.validateItemTypeProperty(e).toPromise();
}
}
