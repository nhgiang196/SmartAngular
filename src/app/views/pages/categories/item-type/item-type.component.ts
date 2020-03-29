import { Component, OnInit, ViewChild } from '@angular/core';


import { ItemTypeService, AuthService, ItemTypePropertyService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import DataGrid from "devextreme/ui/data_grid";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource: any;
  dataSourceItemProperty: any;
  selectedRowIndex = -1;
  
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.dataSource = this.itemTypeService.getDataGridItemType(this.dataSource, 'ItemTypeId');    
    this.dataSourceItemProperty = this.itemTypePropertyService.getDataGridItemTypeProperty(this.dataSourceItemProperty, "ItemTypePropertyId", '');
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }
  /**
   * Function Insert
   * @param e with e is params in DevExtreme
   */

  onRowInsertingItemTypeProperty(e) {
    console.log(e);
    e.data.ItemTypeId = 1;
    this.itemTypePropertyService.addItemTypeProperty(e.data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Insert success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
      this.dataGrid.instance.refresh();
    });
  }
  async onValidateItemTypeName(e) {
    return await this.itemTypeService.validateItemType(e).toPromise();
  }
  async onRowUpdatingItemType(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0

    let validateResult: any = await this.onValidateItemTypeName(data)
    // debugger;
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
  onRowUpdatingItemTypeProperty(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    this.itemTypePropertyService.updateItemTypeProperty(data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Update success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  }
  onRowRemovingItemTypeProperty(e) {
    this.itemTypePropertyService.deleteItemTypeProperty(e.data.ItemTypeId).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Delete success!', 'Success!');
        this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  }
  getDataSourceItemProperty(key)
  {
    console.log(key);
    this.dataSourceItemProperty = 
        this.itemTypePropertyService.getDataGridItemTypeProperty(this.dataSourceItemProperty, "ItemTypePropertyId", '');
        return this.dataSourceItemProperty;
  }
  editRow() { 
    this.dataGrid.instance.editRow(this.selectedRowIndex);
    this.dataGrid.instance.deselectAll();
   // this.getDataSourceItemTypePropertyId();
  }
  // getDataSourceItemTypePropertyId()
  // {
  //   this.dataSourceItemProperty = this.itemTypePropertyService.getDataGridItemTypeProperty(this.dataSourceItemProperty, "ItemTypePropertyId")
  // }
  /**
   * Init Function
   * @param e fd
   */
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }
  selectedChanged(e) {
    console.log(e);
    this.dataSourceItemProperty = this.itemTypePropertyService.getDataGridItemTypeProperty(this.dataSourceItemProperty, "ItemTypePropertyId", '');  
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
////////////////////////master detail
  // update(e){
  //   console.log(e);
  // }

  // dataSourceItemTypeProperty(e){
  //   console.log(e);
  //   return this.itemTypePropertyService.getDataGridItemTypeProperty(this.dataSourceItemProperty, "ItemTypePropertyId")
  // }
  // buttonClick(e, key) {
  //   let detailGridId = `detailGrid${key}`;
  //   let element = document.getElementById(detailGridId);
  //   let instance = DataGrid.getInstance(element) as DataGrid;
  //   instance.option("focusedRowIndex", 0);
  // }

}
