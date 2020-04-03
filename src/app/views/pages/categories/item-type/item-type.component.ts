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
  dataSourceProperties: ItemTypeProperty[] = []//any = {};
  itemTypeId: number = 0;
  detail: ItemTypeProperty[] = [];
  index = 999;
  isUpdate: boolean;
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    //LOAD MSTER GRID
    this.dataSourceItemTypes = this.itemTypeService.getDataGridItemType(); // default load with new Customer Store

    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }

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
  }
  /**
   * Init new Row for ItemType
   * @param e params with new ItemType
   */
  onInitNewRow(e) {
    this.dataSourceProperties = [];
    this.isUpdate = true;
  }
  /**
   * Prepare ItemType dataSource to Add
   * It will be execute in ItemTypeService
   * @param e params as ItemType with dataSourcePropeties
   */
  onRowInsertingItemType(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
    e.data.CreateDate = new Date();
    e.data.ItemTypeId = 0;
    e.data.ItemTypeProperty = [];
    e.data.ItemTypeProperty = this.resetItemTypePropertyId(this.dataSourceProperties);// đây là khi lưu cha con nó lưu luôn
  }
  /**
   * reset itemTypePropertyId = 0 
   * Although use for instead of forEach. But I used forEach to read easier.
   * @param dataSource 
   */
  resetItemTypePropertyId(dataSource) {
    dataSource.forEach(item=>{
      item.ItemTypePropertyId = 0
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
    data.ItemTypeProperty = this.resetItemTypePropertyId(this.dataSourceProperties)
    e.newData = data;//set object
  }

  ////DETAIL/////////////////
  //Insert Detail
  onInitNewRowDetail(e) {
    e.data.ItemTypePropertyId = this.index++; // create with not exist id
    e.data.ItemTypeId = this.itemTypeId;
  }

  ///Validate
  async onValidateItemTypeName(e) {
    //return await this.itemTypeService.validateItemType(e).toPromise();
  }
  //Detail validata
  detailValidation(property) {
    let isExsit = 0;
    this.dataSourceProperties.forEach(element => {
      if (element.ItemTypePropertyName == property.data.ItemTypePropertyName
        && element.ItemTypePropertyId != property.data.ItemTypePropertyId) {
        isExsit++
      }
    });
    if (isExsit > 0) return false;
    else return true;
  }

  ItemTypePropertyValidata(property) {

  }
  async onValidateItemTypeProperty(e) {
    return await this.itemTypePropertyService.validateItemTypeProperty(e).toPromise();
  }
}
