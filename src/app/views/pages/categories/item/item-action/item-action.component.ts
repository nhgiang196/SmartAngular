import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Item, ItemFactory, ItemProperty, ItemPackage, ItemFile, ItemType } from 'src/app/core/models/item';
import { Subject } from 'rxjs';
import { UnitService, AuthService, ItemService } from 'src/app/core/services';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import swal from "sweetalert2";
import { DxDataGridComponent } from 'devextreme-angular';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { async } from 'rxjs/internal/scheduler/async';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-item-action',
  templateUrl: './item-action.component.html',
  styleUrls: ['./item-action.component.css']
})
export class ItemActionComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  entity: Item = new Item();
  dataSourceItemFactory: any;
  dataSourceItemTypeProperty: any;
  dataSourceFactory: any;
  dataSourceUnit:any;
  minMode: BsDatepickerViewMode = "year";
  bsConfig: Partial<BsDatepickerConfig>;
  //parten
  numberPattern:'^\\d+$' ;
  //set rowEdit
  editRowId: number = 0;

  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  laddaSubmitLoading = false;
  files: File[] = [];
  fileImages: File[] = [];

  listImages: Array<ItemFile> = new Array<ItemFile>();
  listFiles: Array<ItemFile> = new Array<ItemFile>();

  addFiles: { FileList: File[]; FileLocalNameList: string[] };

  constructor(private itemService: ItemService, private route: ActivatedRoute,private auth: AuthService,public helper: MyHelperService,private toastr: ToastrService,
    private trans: TranslateService,  private router: Router) { }

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat: "YYYY",
        adaptivePosition: true
      }
    );
    var item = this.route.snapshot.data["item"] as Item;
    if (item != null) {
      this.entity = item;
      this.loadItemPropertySelectBox(item.ItemTypeId);
    }
    this.loadFactorySelectBox();
    this.loadUnitSelectbox();

  }

 async fnSave() {
    console.log(this.entity);

    this.laddaSubmitLoading = true;
    let e = this.entity;
    if(e.ItemManufactureYear!=0 && e.ItemManufactureYear!=null ){
      e.ItemManufactureYear = this.helper.yearConvertToString(
        new Date(e.ItemManufactureYear)
      );
    }
    else{
      e.ItemManufactureYear =null;
    }


    if (this.entity.ItemId ==0) e.CreateBy = this.auth.currentUser.Username;
    else e.ModifyBy = this.auth.currentUser.Username;
    console.log(e);
    //Clear rác
    if (this.entity.ItemId ==0) {
      if (await this.fnValidate(e)) {
        this.itemService.addItem(e).subscribe(
          res => {
            let operationResult: any = res;
            if (operationResult.Success) {
              this.toastr.success(this.trans.instant("messg.add.success"));
            } else {
              this.toastr.warning(operationResult.Message);
              return;
            }
            this.laddaSubmitLoading = false;
            //this.uploadFile(this.addFiles.FileList);
            this.router.navigate(["/category/item/" + this.entity.ItemTypeId]);
          },
          err => {
            this.toastr.error(err.statusText);
            console.log(err.statusText);
          }
        );
      } else {
        this.toastr.warning("Validate", "Tên hóa chất đã tồn tại");
      }
    } else {
      console.log(">>", this.entity);
      this.itemService.updateItem(e).subscribe(
        res => {
          let operationResult: any = res;
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          } else {
            this.toastr.warning(operationResult.Message);
            console.log(operationResult.statusText);
            return;
          }
          this.laddaSubmitLoading = false;
          //this.uploadFile(this.addFiles.FileList);
          this.router.navigate(["/pages/category/item"]);
        },
        err => {
          this.toastr.error(err.statusText);
          this.laddaSubmitLoading = false;
        }
      );
    }
  }

  private async fnValidate(e) {
    let result = !(await this.itemService
      .checkItemNameExist(this.entity.ItemName)
      .toPromise()
      .then());
    if (!result) {
      this.laddaSubmitLoading = false;
    }
    return result;
  }
  //Area ItemType///
  itemTypeChange(value) {
    this.loadItemPropertySelectBox(value);
  }

  ///Area Item Factory////
  onRowValidatingFactory(e) {
    console.log("validate", e);
    console.log(this.entity)
    if (e.oldData == null) {
      //thêm mới
      if (this.entity.ItemFactory.find(x => x.FactoryId == e.newData.FactoryId)) {
         swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (this.entity.ItemFactory.find(x => x.FactoryId == e.newData.FactoryId) && e.newData.FactoryId != e.oldData.FactoryId) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }

  }

  loadFactorySelectBox() {
    let keyId = "FactoryId";

    this.dataSourceFactory = createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/Factory/UI_SelectBox`,
      loadParams: { keyId: keyId },
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.data.keyId = keyId;
        if (ajaxOptions.data.filter != null) {

          let dataParse = JSON.parse(ajaxOptions.data.filter);
          if (dataParse.length == 2)
            dataParse = JSON.parse(JSON.stringify([dataParse]));
          dataParse.push('and');
          dataParse.push(["Status", "=", 1]);
          ajaxOptions.data.filter = JSON.stringify(dataParse);
        }
        else {
          ajaxOptions.data.filter = JSON.stringify(["Status", "=", 1]);
        }
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  ///Area Item Property////
  onRowValidatingItemProperty(e) {
    console.log("validate item property", e);
    console.log(this.entity)
    if (e.oldData == null) {
      //thêm mới
      if (this.entity.ItemProperty.find(x => x.ItemTypePropertyId == e.newData.ItemTypePropertyId)) {
         swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (this.entity.ItemProperty.find(x => x.ItemTypePropertyId == e.newData.ItemTypePropertyId) && e.newData.ItemTypePropertyId != e.oldData.ItemTypePropertyId) {
         swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }

  }
  loadItemPropertySelectBox(itemTypeId) {
    let keyId = "ItemTypePropertyId";

    this.dataSourceItemTypeProperty = createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/ItemTypeProperty/UI_SelectBox`,
      loadParams: { keyId: keyId },
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.data.keyId = keyId;
        if (ajaxOptions.data.filter != null) {

          let dataParse = JSON.parse(ajaxOptions.data.filter);
          if (dataParse.length == 2)
            dataParse = JSON.parse(JSON.stringify([dataParse]));
          dataParse.push('and');
          dataParse.push(["ItemTypeId", "=", itemTypeId]);
          ajaxOptions.data.filter = JSON.stringify(dataParse);
        }
        else {
          ajaxOptions.data.filter = JSON.stringify(["ItemTypeId", "=", itemTypeId]);
        }
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  ///Area Item Package////
  onRowValidatingUnit(e){

    if(e.newData.ItemPackageUnitId == this.entity.ItemUnitId){
      e.isValid = false;
      swal.fire("Validate", "Dữ liệu đã bị trùng với unit đã chọn ngoài tab thông tin", "warning");
    }

   else if (e.oldData == null) {
      //thêm mới
      if (this.entity.ItemPackage.find(x => x.ItemPackageUnitId == e.newData.ItemPackageUnitId)) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (this.entity.ItemPackage.find(x => x.ItemPackageUnitId == e.newData.ItemPackageUnitId) && e.newData.ItemPackageUnitId != e.oldData.ItemPackageUnitId) {
         swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
  }

  loadUnitSelectbox(){
    let keyId = "UnitId";

    this.dataSourceUnit = createStore({
      key: keyId,
      loadUrl: `${environment.apiUrl}/Unit/UI_SelectBox`,
      loadParams: { keyId: keyId },
      onBeforeSend: function (method, ajaxOptions) {
        ajaxOptions.data.keyId = keyId;
        if (ajaxOptions.data.filter != null) {

          let dataParse = JSON.parse(ajaxOptions.data.filter);
          if (dataParse.length == 2)
            dataParse = JSON.parse(JSON.stringify([dataParse]));
          dataParse.push('and');
          dataParse.push(["Status", "=", 1]);
          ajaxOptions.data.filter = JSON.stringify(dataParse);
        }
        else {
          ajaxOptions.data.filter = JSON.stringify(["Status", "=", 1]);
        }
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  ///FILE////
  customFile() {
    /**CONTROL FILES */
    this.entity.ItemFile.forEach(item => {
      let _tempFile = new File([], item.File.FileLocalName);
      if (item.IsImage) {
        this.listImages = this.entity.ItemFile.filter(x => x.IsImage == true);
      } else {
        this.listFiles = this.entity.ItemFile.filter(x => x.IsImage == false);
      }
    });
    console.log(this.listImages);
    console.log(this.listFiles);
    this.entity.ModifyBy = this.auth.currentUser.Username;
  }


}
