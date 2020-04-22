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
import { NotifyService } from 'src/app/core/services/utility/notify.service';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {

  @ViewChild("masterDataGrid", { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild("detailDataGrid", { static: false }) detailGrid: DxDataGridComponent
  dataSourceItemTypes: any;
  dataSourceProperties: ItemTypeProperty[] = []//any = {};
  itemTypeId: number = 0;
  detail: any
  index = 999;
  isUpdate: boolean;
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService,
    private notifyService: NotifyService,
    
  ) {
    //LOAD MSTER GRID
    this.dataSourceItemTypes = this.itemTypeService.getDataGrid(false); // default load with new Customer Store
    this.masterValidation = this.masterValidation.bind(this);
    this.detailValidation = this.detailValidation.bind(this);
    config({
      floatingActionButtonConfig: directions.down
    });
    this.fnDeleteDetail = this.fnDeleteDetail.bind(this);
  }
  ngOnInit() { }

  addRow() {
    this.dataGrid.instance.addRow();
    this.dataGrid.instance.deselectAll();
  }


  //Load popup by propertyId
  async filterByItemTypeId(e) {
    this.dataSourceProperties = (await this.itemTypePropertyService
      .findItemTypePropertyByItemTypeId(e.data.ItemTypeId)
      .toPromise()
      .then());
    this.isUpdate = false;
    this.itemTypeId = e.data.ItemTypeId
    return this.dataSourceProperties;
  }

  //Trigger for raise event update
  onEditorPreparing(e) {
    if (e.dataField == "ItemTypeName" && e.parentType === "dataRow") {
      e.setValue((e.value == null) ? "" : (e.value + "")); // Updates the cell value
    }
    //Prepare Status editor to dxSwitch 
    // if (e.dataField == "Status" && e.parentType === "dataRow") {
    //   e.editorName = "dxSwitch"; 
    // }
  }
 
  /**
   * Init new Row for ItemType
   * @param e params with new ItemType
   */
  onInitNewRow(e) {
    this.dataSourceProperties = [];
    this.isUpdate = true;
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.ItemTypeId = 0;
    e.data.ItemTypeProperty = [];
  }
  /**
   * Prepare ItemType dataSource to Add
   * It will be execute in ItemTypeService
   * @param e params as ItemType with dataSourcePropeties
   */
  async onRowInsertingItemType(e) {
    console.log(e);
    e.data.Status = e.data.Status ? 1 : 0;
    e.data.ItemTypeProperty = this.resetItemTypePropertyId(this.dataSourceProperties);// đây là khi lưu cha con nó lưu luôn
  }
  /**
   * reset itemTypePropertyId = 0 
   * Although use for instead of forEach. But I used forEach to read easier.
   * @param dataSource 
   */
  resetItemTypePropertyId(dataSource) {
    dataSource.forEach(item => {
      if(item.ItemTypePropertyId >= 999){
      item.ItemTypePropertyId = 0
      }
    })
    return dataSource;
  }
  /**
   * Prepare ItemType dataSource to Update
   * It will be execute in ItemTypeService
   * @param e params as ItemType with dataSourcePropeties
   */
  onRowUpdatingItemType(e) {
    //reAssign for get properties of oldData
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.ModifyDate = new Date();
    data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    data.ItemTypeProperty = this.resetItemTypePropertyId(this.dataSourceProperties);
    e.newData = data;//set object
    console.log(e.newData);
  }

  ////DETAIL/////////////////
  //Insert Detail
  onInitNewRowDetail(e) {
    e.data.ItemTypePropertyId = this.index++; // create with not exist id
    e.data.ItemTypeId = this.itemTypeId;
  }

  masterValidation(e) {
    if (e.newData == null) {
      if (e.value == "" || e.value == null) {
        return new Promise((resolve, reject) => {
          reject("Field is empty!");
        });

      } else {
        if(e.data.Status == true) e.data.Status= 1
        if(e.data.Status == false) e.data.Status= 0 
        return new Promise((resolve, reject) => {
          this.itemTypeService.validate(e.data)
            .then((result: any) => {
              result.Success ? resolve() : reject("ItemType already exist!");
              resolve(result);
            }).catch(error => {
              resolve();
            });
        });
      }
    }
  }

  detailValidation(e) {
    let isExsit = 0;
   
    if (e.value == "" || e.value == null) {
      e.rule.message = "Field is empty!";
      return false;
    }
    this.dataSourceProperties.forEach(element => {
      if (element.ItemTypePropertyName == e.data.ItemTypePropertyName
        && element.ItemTypePropertyId != e.data.ItemTypePropertyId) {
        isExsit++
        return
      }
    });
    if (isExsit > 0) {
      e.rule.message = "Property already exist!";
      return false;
    } else return true;
  }

  onDataErrorOccurred(e)
  {
    console.log(e);
    this.toastr.error("Can't delete!","Error");
  }

  fnDeleteDetail(e){
    console.log(e);
    this.itemTypeService.checkForeignKey(e.row.data.ItemTypePropertyId).then((result: any)=>{
      if(result.Success){
        this.detailGrid.instance.deleteRow(e.row.rowIndex);
        //this.detailGrid.instance.removeRow(2);
        console.log(e);
      }else{
        this.notifyService.error("Dữ liệu đã phát sinh, không thể xóa!");
      }
    });
  }
}
