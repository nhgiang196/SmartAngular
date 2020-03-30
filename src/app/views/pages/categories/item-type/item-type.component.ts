import { Component, OnInit, ViewChild } from '@angular/core';


import { ItemTypeService, AuthService, ItemTypePropertyService } from 'src/app/core/services';
import { DxDataGridComponent } from 'devextreme-angular';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { ToastrService } from 'ngx-toastr';
import DataGrid from "devextreme/ui/data_grid";
import Swal from 'sweetalert2';
import { ItemTypeProperty } from 'src/app/core/models/item';
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
  dataSourceProperties: any;
  entity: any
  detailDelete: any;

  selectedRowIndex = -1;
  
  constructor(
    private itemTypeService: ItemTypeService,
    private itemTypePropertyService: ItemTypePropertyService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.dataSourceItemTypes = this.itemTypeService.getDataGridItemType(this.dataSourceItemTypes, 'ItemTypeId'); // default load
    config({
      floatingActionButtonConfig: directions.down
    });
  }
  ngOnInit() { }
  /**
   * Function Insert
   * @param e with e is params in DevExtreme
   * all Field in ItemProperty
   * with ItemPropertyName
   */
  async onRowInsertingProperty(e) {
    console.log(e);
    e.data.ItemTypeId = this.itemTypeId;
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
    this.itemTypeProperties.push(e.data)// thằng con owrd đây
    this.dataSourceProperties.push(this.itemTypeProperties);
    console.log(this.itemTypeProperties);
    
  }
  /**
   * Validate ItemTypeName have to not exist
   * @param e validate 2 params with ItemTypeName and ItemTypeCode
   */
  async onValidateItemTypeName(e) {
    return await this.itemTypeService.validateItemType(e).toPromise();
  }
  async onValidateItemTypeProperty(e) {
    return await this.itemTypePropertyService.validateItemTypeProperty(e).toPromise();
  }
  /**
   * Update ItemType
   * @param e Update with ItemType parames
   */
  async onRowUpdatingItemType(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    data.ModifyBy = this.auth.currentUser.Username;
    data.Status = data.Status ? 1 : 0; //tenary operation if (data.status == true) return 1 else return 0
    data.ItemTypeProperty = this.itemTypeProperties;// đây là khi lưu cha con nó lưu luôn
    console.log('Save Master detail')
    console.log(data);
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
  /**
   * Update ItemTypeProperty
   * @param e params for Property Detail DataGrid
   * Only ItemTypePropetyName
   */
  onRowUpdatingProperty(e) {
    // Modify entity olddata to newdata;
    const data = Object.assign(e.oldData, e.newData);
    this.itemTypePropertyService.updateItemTypeProperty(data).subscribe(res => {
      const result = res as any;
      if (result.Success) {
        this.toastr.success('Update success!', 'Success!');
        // this.dataGrid.instance.refresh();
      } else {
        Swal.fire('Error!', result.Message, 'error');
      }
    });
  }đo
  /**
   * Remove ItemTypePropertyId
   * @param e with ItemTypePropertyId
   */
  onRowRemovingProperty(e) {
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
  /**
   * filter all itemTypeProperties with ItemTypeId in row selected
   * @param e itemTypeId
   */
  filterByItemTypeId(e){
    ////cái e này là entity na anh
    //z là đc rồi đo
    //
    //cái này là của thằng cha để lấy cái itemTypeId ///
    this.itemTypeId = e.data.ItemTypeId;
    this.dataSourceProperties = 
        this.itemTypePropertyService.getDataGridItemTypePropertyByItemTypeId(this.dataSourceProperties, "ItemTypePropertyId", this.itemTypeId);
    this.entity = e.data;
        console.log( this.entity);  
  }

  /**
   * Init Function
   * @param e some fields default value
   */
  onInitNewRow(e) {
    e.data.Status = 1;
    e.data.CreateBy = this.auth.currentUser.Username;
  }



}
