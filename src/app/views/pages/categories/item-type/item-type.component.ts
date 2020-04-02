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

  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSourceItemTypes: any;
  itemTypeId : number =0;
  itemTypeProperties : ItemTypeProperty []= []
  dataSourceProperties: any = {};
  entity: any;
  detail: ItemTypeProperty []= [];
  oldDetail: any;
  detailDelete: any;
  selectedRowIndex = -1;
  action = "";
  index = 999;
  isDisable: boolean;
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.dataSourceItemTypes = this.itemTypePropertyService.getTest(this.dataSourceItemTypes, 'ItemTypeId'); // default load
    console.log(this.dataSourceItemTypes);
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }

//Load popup by propertyId
  async filterByItemTypeId(e){
    this.action = "UPDATE";
    //console.log(e);
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
  this.action="NEW";
  e.data.Status = 1;
  e.data.CreateBy = this.auth.currentUser.Username;
  e.data.ItemTypeId = 0;
  e.data.ItemTypeProperty=[];
  this.isDisable = false;
}
//Insert Master
 async onRowInsertingItemType(e){
   //this.detail.ItemTypePropertyId = null
  e.data.ItemTypeProperty = this.detail;// đây là khi lưu cha con nó lưu luôn
  e.data.ItemTypeProperty.forEach(element => {
    element.ItemTypePropertyId=0;
  });
  console.log(e.data);
  
  //let validateResult: any = await this.onValidateItemTypeName(e.data)
 // if (!validateResult.Success)
   // this.toastr.error('ItemTypeName already exsited!', 'Error!');
  //else {
    this.itemTypeService.addItemType(e.data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Add success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  //}
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

//Update Master
async onRowUpdatingItemType(e) {
  
  const data = Object.assign(e.oldData, e.newData);

  data.ModifyBy = this.auth.currentUser.Username;
  data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
  data.ItemTypeProperty = this.detail;// đây là khi lưu cha con nó lưu luôn
  data.ItemTypeProperty.forEach(element => {
    element.ItemTypePropertyId=0;
  });

  console.log('Save Master detail')
  console.log(data);
  let validateResult: any = await this.onValidateItemTypeName(data)

  if (!validateResult.Success)
    this.toastr.error('ItemTypeName already exsited!', 'Error!');
  else {
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
    console.log(this.detail)
  }
//Update Detail
  onRowUpdatingProperty(e)
  {
    console.log(this.detail)
  }

///Validate
async onValidateItemTypeName(e) {
  return await this.itemTypeService.validateItemType(e).toPromise();
}
//Detail validata
ItemTypePropertyValidata(property)
{ 
  let exist = 0
  this.detail.forEach(element =>{
    if(element.ItemTypePropertyName == property.ItemTypePropertyName){
      Swal.fire('Error!', "ItemTypeProperty Existed", 'error');
      return false
    }
  });
}
async onValidateItemTypeProperty(e) {
  return await this.itemTypePropertyService.validateItemTypeProperty(e).toPromise();
}
























  //async onRowInsertingProperty(e) {
    //console.log(e.data);
    //e.data.ItemTypeId = this.itemTypeId;
    //e.data.ItemTypePropertyId = 0;
    //this.itemTypeProperties.push(e.data)// thằng con owrd đây
    //this.dataSourceProperties.push(this.itemTypeProperties);
    //this.entity.ItemTypeProperty.push(this.itemTypeProperties);
    //console.log(this.itemTypeProperties);
    // let validateResult: any = await this.onValidateItemTypeProperty( e.data)
    // if (!validateResult.Success)
    //   this.toastr.error('ItemTypePropertyName already exsited!', 'Error!');
    // else {
    //   this.itemTypePropertyService.addItemTypeProperty(e.data).subscribe(res => {
    //     const result = res as any;
    //     if (result.Success) {
    //       this.toastr.success('Insert success!', 'Success!');
    //       this.dataGrid.instance.refresh();
    //     } else {
    //       Swal.fire('Error!', result.Message, 'error');
    //     }
    //     this.dataGrid.instance.refresh();
    //   });
    // detail them ở đây
 // }
  //async onRowUpdatingProperty(e) {
    
    // Modify entity olddata to newdata;
   // const data = Object.assign(e.oldData, e.newData);
    //console.log(data);
   // this.itemTypeProperties.map(data);
    // push({ItemTypeId: data.ItemTypeId,
    //   ItemTypePropertyId: data.ItemTypePropertyId,
    //   ItemTypePropertyName: data.ItemTypePropertyName});
    //console.log(this.itemTypeProperties);
    // this.itemTypePropertyService.updateItemTypeProperty(data).subscribe(res => {
    //   const result = res as any;
    //   if (result.Success) {
    //     this.toastr.success('Update success!', 'Success!');
    //     // this.dataGrid.instance.refresh();
    //   } else {
    //     Swal.fire('Error!', result.Message, 'error');
    //   }
    // });
 // }
  /**
   * Validate ItemTypeName have to not exist
   * @param e validate 2 params with ItemTypeName and ItemTypeCode
   */
 
  /**
   * Update ItemType
   * @param e Update with ItemType parames
   */
 //onRowUpdatingItemType(e) {
    //console.log(this.dataSourceProperties);
    // Modify entity olddata to newdata;
    // const data = Object.assign(e.oldData, e.newData);
    // data.ModifyBy = this.auth.currentUser.Username;
    // data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    // data.ItemTypeProperty = this.itemTypeProperties;// đây là khi lưu cha con nó lưu luôn
    //console.log('Save Master detail')
    //console.log(data);
    //let validateResult: any = await this.onValidateItemTypeName(data)
    // debugger;
    // if (!validateResult.Success)
    //   this.toastr.error('ItemTypeName already exsited!', 'Error!');
    // else {
    //   this.itemTypeService.updateItemType(data).subscribe(res => {

    //     const result = res as any;
    //     if (result.Success) {
    //       this.toastr.success('Update success!', 'Success!');
    //       this.dataGrid.instance.refresh();
    //     } else {
    //       Swal.fire('Error!', result.Message, 'error');
    //     }
    //   });
    //}

  //}

  

 

  /**
   * Init Function
   * @param e some fields default value
   */
 


}
