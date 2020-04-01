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
import { HttpEventType } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { FileService } from 'src/app/core/services/file.service';
declare var $ :any;
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
  //set rowEdit
  isEditRow: boolean  = false;
  pathFile = "uploadFileItems";
  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  laddaSubmitLoading = false;
  files: File[] = [];
  fileImages: File[] = [];

  listImages: Array<ItemFile> = new Array<ItemFile>();
  listFiles: Array<ItemFile> = new Array<ItemFile>();

  addFiles: { FileList: File[]; FileLocalNameList: string[] };

  constructor(private itemService: ItemService, private route: ActivatedRoute,private auth: AuthService,public helper: MyHelperService,private toastr: ToastrService,
    private trans: TranslateService,  private router: Router,private fileService:FileService) { }

  ngOnInit() {
    var item = this.route.snapshot.data["item"] as Item;
    if (item != null) {
      this.entity = item;
      this.loadItemPropertySelectBox(item.ItemTypeId);
      this.customFile();
    }
    this.addFiles = { FileList: [], FileLocalNameList: [] };
    this.loadFactorySelectBox();
    this.loadUnitSelectbox();
    this.bsConfig = Object.assign({},{
      minMode: this.minMode,
      dateInputFormat: "YYYY",
      adaptivePosition: true
    });

    this.enableActiveTab();
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
            this.uploadFile(this.addFiles.FileList);
            this.router.navigate(["/pages/category/item/" + this.entity.ItemTypeId]);
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
          this.uploadFile(this.addFiles.FileList);
          this.router.navigate(["/pages/category/item/" + this.entity.ItemTypeId]);
        },
        err => {
          this.toastr.error(err.statusText);
          this.laddaSubmitLoading = false;
        }
      );
    }
  }


  enableActiveTab(){
    let self = this;
    $(".dx-link-save[aria-label='Save']").click(function (event) {
      self.isEditRow =false;
    });
    $(".dx-link-cancel[aria-label='Cancel']").click(function (event) {
      self.isEditRow =false;
    });
  }

  onSwitchStatus() {
    //modal switch on change
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
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

  ////////////////File ////////////
  onRemove(event, isImage) {
    const file = event as ItemFile;
    //press x to delte file (in modal)
    console.log(event);
    if (isImage) {
      let indexListImage = this.listImages.findIndex(
        x => x.File.FileOriginalName == file.File.FileOriginalName
      );
      let indexListEntity = this.entity.ItemFile.findIndex(
        x =>
          x.IsImage == true &&
          x.File.FileOriginalName == file.File.FileOriginalName
      );
      this.listImages.splice(indexListImage, 1); //UI del
      this.entity.ItemFile.splice(indexListEntity, 1);
    } else {
      let indexListImage = this.listFiles.findIndex(
        x => x.File.FileOriginalName == file.File.FileOriginalName
      );
      let indexListEntity = this.entity.ItemFile.findIndex(
        x =>
          x.IsImage == false &&
          x.File.FileOriginalName == file.File.FileOriginalName
      );
      this.listFiles.splice(indexListImage, 1); //UI del
      this.entity.ItemFile.splice(indexListEntity, 1);
    }

    // this.removeFile(event);
  }
  downloadFile(filename) {
    this.fileService.downloadFile(this.pathFile + "/" + filename);
  }

   uploadFile(files: File[]) {
    //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.fileService.uploadFile(formData, this.pathFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadReportProgress.progress = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event.type === HttpEventType.Response) {
          this.uploadReportProgress.message = "Upload success";
          // this.onUploadFinished.emit(event.body);
        }
      },
      err => {
        this.toastr.warning(err.statusText, "Upload file bị lỗi");
        this.uploadReportProgress = {
          progress: 0,
          message: "Error",
          isError: true
        };
      }
    );
  }

  isFileImage(file) {
    return file && file["type"].split("/")[0] === "image";
  }
  async onSelect(event, isImage) {
    //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length > 0)
      this.toastr.warning(this.trans.instant("messg.maximumFileSize5000"));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.entity.ItemFile;
      console.log(this.listImages);
      let findElement: ItemFile = null;
      if (isImage)
        findElement = this.listImages.find(
          x => x.File.FileOriginalName == item.name
        );
      else {
        findElement = this.listFiles.find(
          x => x.File.FileOriginalName == item.name
        );
      }
      //ASK THEN GET RESULT
      if (findElement != null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload = true;
          await swal
            .fire({
              title: "File trùng",
              titleText:
                "Một số file bị trùng, bạn có muốn đè các file này lên bản gốc?",
              type: "warning",
              showCancelButton: true,
              reverseButtons: true
            })
            .then(result => {
              if (result.dismiss === swal.DismissReason.cancel)
                allowUpload = false;
            });
        }
        if (!allowUpload) return;

        console.log(findElement);
        //ghi đè file
        if (isImage) {
          let _indextFileEntity = this.entity.ItemFile.findIndex(
            x =>
              x.IsImage == true &&
              x.File.FileOriginalName == findElement.File.FileOriginalName
          );
          let _indextFileList = this.entity.ItemFile.filter(
            x => x.IsImage == true
          ).findIndex(
            x => x.File.FileOriginalName == findElement.File.FileOriginalName
          );
          //change file in entity
          this.listImages.splice(_indextFileList, 1);
          //  this.listImages =this.listImages.splice(1,1);
          this.addFiles.FileList.splice(_indextFileEntity, 1);
        } else {
          let _indextFileEntity = this.entity.ItemFile.findIndex(
            x =>
              x.IsImage == false &&
              x.File.FileOriginalName == findElement.File.FileOriginalName
          );
          let _indextFileList = this.entity.ItemFile.filter(
            x => x.IsImage == false
          ).findIndex(
            x => x.File.FileOriginalName == findElement.File.FileOriginalName
          );
          //change file in entity
          this.listFiles.splice(_indextFileList, 1);
          //  this.listImages =this.listImages.splice(1,1);
          this.addFiles.FileList.splice(_indextFileEntity, 1);
        }
      } else {
        let _itemFile = new ItemFile();
        _itemFile.File.FileOriginalName = item.name;
        _itemFile.File.FileLocalName = convertName;
        _itemFile.File.Path = this.pathFile + "/" + convertName;
        _itemFile.File.FileType = item.type;
        if (isImage) _itemFile.IsImage = true;
        this.entity.ItemFile.push(_itemFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }
    }
    if (isImage) {
      this.listImages = this.entity.ItemFile.filter(x => x.IsImage == true);
    } else {
      this.listFiles = this.entity.ItemFile.filter(x => x.IsImage == false);
    }
    this.addFiles.FileList.push(...event.addedFiles);
  }


}
