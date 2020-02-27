import { Component, OnInit } from "@angular/core";
import {
  Item,
  ItemProperty,
  Factory,
  ItemFactory,
  DataTablePaginationParram,
  Unit,
  ItemPackage,
  FactoryFile,
  ItemFile
} from "src/app/models/SmartInModels";
import { Subject } from "rxjs";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import swal from "sweetalert2";
import { MyHelperService } from "src/app/services/my-helper.service";
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"]
})
export class ItemListComponent implements OnInit {
  code: string = "HC";
  Items: Item[];
  entity: Item;
  factory: Factory;
  itemFactory: ItemFactory = new ItemFactory();
  itemProperty: ItemProperty = new ItemProperty();
  itemPackage: ItemPackage = new ItemPackage();

  ItemProperty: ItemProperty;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public ACTION_STATUS: string;
  iboxloading = false;
  laddaSubmitLoading = false;
  files: File[] = [];
  private pathFile = "uploadFilesItem";

  //get token use select 2

  // option: Select2Options = {
  //   ajax: {
  //     url: "/api/v1/Unit/GetUnitPagination",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //       // "Authorization": `Bearer ${localStorage.getItem("userToken")}`
  //     },
  //     beforeSend: function(xhr) {
  //       debugger;
  //       xhr.setRequestHeader(
  //         "Authorization",
  //         "Bearer " + localStorage.getItem("userToken")
  //       );
  //     },
  //     type: "POST",
  //     dataType: "json",
  //     data: function(params) {
  //       const model = new DataTablePaginationParram();
  //       model.key = "";
  //       model.entity = "Unit";
  //       model.keyFields = "";
  //       model.selectFields = "UnitID,UnitName";
  //       model.page = 1;
  //       model.pageSize = 9999;
  //       model.orderDir = "Asc";
  //       model.orderBy = "UnitName";

  //       return model;
  //     },
  //     processResults: function(data, params) {
  //       return {
  //         results: $.map(data, function(item) {
  //           return {
  //             text: item.content,
  //             id: item.id,
  //             data: item
  //           };
  //         })
  //       };
  //     }
  //   }
    
  // };

  listFactory: any = [];
  listProperty: any = [];
  listUnit: any = [];

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadInit();
    this.resetEntity();
    //  this.serverSide();
    this.loadFactory();
    this.loadProperty();
    this.loadUnit();
  }

  private resetEntity() {
    this.entity = new Item();
    this.ItemProperty = new ItemProperty();
    this.itemFactory = new ItemFactory();
    this.itemPackage = new ItemPackage();
    this.itemProperty = new ItemProperty();
  }

  loadInit = () => {
    this.dtOptions = {
      autoWidth: true,
      responsive: true,
      pagingType: "full_numbers",
      pageLength: 10,
      language: {
        searchPlaceholder: "Nhập nội dung tìm kiếm",
        emptyTable: this.trans.instant("DefaultTable.emptyTable"),
        info: this.trans.instant("DefaultTable.info"),
        infoEmpty: this.trans.instant("DefaultTable.infoEmpty"),
        infoFiltered: this.trans.instant("DefaultTable.infoFiltered"),
        infoPostFix: this.trans.instant("DefaultTable.infoPostFix"),
        thousands: this.trans.instant("DefaultTable.thousands"),
        lengthMenu: this.trans.instant("DefaultTable.lengthMenu"),
        loadingRecords: this.trans.instant("DefaultTable.loadingRecords"),
        processing: this.trans.instant("DefaultTable.processing"),
        search: this.trans.instant("DefaultTable.search"),
        zeroRecords: this.trans.instant("DefaultTable.zeroRecords"),
        // url: this.trans.instant('DefaultTable.url'),
        paginate: {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<"
        }
      }
    };
    this.loadItem();
  };

  loadItem = () => {
    $("#myTable")
      .DataTable()
      .clear()
      .destroy();
    this.api.getItem().subscribe(res => {
      console.log(res);
      this.Items = res as any;
      this.dtTrigger.next();
    });
  };

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  fnUpdate(itemId) {
    this.ACTION_STATUS = "update";
    this.files = [];
    this.api.findItemById(itemId).subscribe(res => {
      this.entity = res;

      //Custom factory
      this.entity.ItemFactory.map(itemFactory => {
        let findNameFactory = this.listFactory.find(
          item => item.id == itemFactory.FactoryId
        );
        if (findNameFactory != null) {
          itemFactory.FactoryName = findNameFactory.text;
          return itemFactory;
        }
      });
      //Custom property
      this.entity.ItemProperty.map(itemProperty => {
        let findNameProperty = this.listProperty.find(
          item => item.id == itemProperty.ItemTypePropertyId
        );
        if (findNameProperty != null) {
          itemProperty.ItemPropertyName = findNameProperty.text;
          return itemProperty;
        }
      });

      //Custom Package
      this.entity.ItemPackage.map(itemPackage => {
        let findNamePackage = this.listUnit.find(
          item => item.id == itemPackage.ItemPackageUnitId
        );
        if (findNamePackage != null) {
          itemPackage.ItemPackageUnitName = findNamePackage.text;
          return itemPackage;
        }
      });

      this.itemProperty = new ItemProperty();
      this.itemFactory = new ItemFactory();
      this.itemPackage = new ItemPackage();

      //Xu ly file
      this.entity.ItemFile.forEach(res => {
        let data = new Blob();
        let arrayOfBlob = new Array<Blob>();
        arrayOfBlob.push(data);
        var cstFile = new File(arrayOfBlob, res.File.FileOriginalName);
        this.files.push(cstFile);
      });
    });
  }
  fnDelete(id) {
    swal
      .fire({
        title: this.trans.instant("Factory.DeleteAsk_Title"),
        titleText: this.trans.instant("Factory.DeleteAsk_Text"),
        type: "warning",
        showCancelButton: true,
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.api.deleteItem(id).subscribe(
            res => {
              let operationResult: any = res;
              if (operationResult.Success) {
                swal.fire(
                  "Deleted!",
                  this.trans.instant("messg.delete.success"),
                  "success"
                );
                this.loadInit();
                $("#myModal4").modal("hide");
              } else {
                this.toastr.warning(operationResult.Message);
              }
            },
            err => {
              this.toastr.error(err.statusText);
            }
          );
        }
      });
  }
  fnAdd() {
    // this.ACTION_STATUS = "add";
    // this.resetEntity();
    this.router.navigate(['category/item/action']);

  }
  // fnAddItem() {
  //   if (this.ItemProperty.ItemPropertyName == null) {
  //     this.toastr.warning("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'))
  //     return;
  //   }
  //   this.entity.ItemProperty.push(this.ItemProperty);
  //   this.ItemProperty = new ItemProperty();
  // }
  // fnDeleteItem(index) {
  //   this.entity.ItemProperty.splice(index, 1);
  // }

  ////////////// Area Func Factory///////////////

  loadFactory() {
    const model = new DataTablePaginationParram();
    model.key = "";
    model.entity = "Factory";
    model.keyFields = "";
    model.selectFields = "FactoryID,FactoryName";
    model.page = 1;
    model.pageSize = 9999;
    model.orderDir = "Asc";
    model.orderBy = "FactoryName";

    this.api.getAllFactoryPagination(model).subscribe(res => {
      const result = res as any;
      this.listFactory = result.result.map(item => {
        return { id: item.FactoryID, text: item.FactoryName };
      });

      this.listFactory.unshift({ id: 0, text: "Please select factory" });
    });
  }

  factoryChange(item) {
    if (item != null) this.itemFactory.FactoryName = item.text;
  }

  fnAddFactory() {
    this.itemFactory.IntergrationCode = this.itemFactory.IntergrationCode;

    let isValidate = this.validateFactory(
      this.itemFactory.FactoryId,
      this.itemFactory.IntergrationCode
    );

    //  kiểm tra nhập form
    if (!isValidate) {
      this.toastr.error("Validate", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    //  kiểm tra xem phần tử đã tồn tại trong mảng hay chưa
    let ifExits = this.entity.ItemFactory.find(
      x =>
        x.FactoryId == this.itemFactory.FactoryId &&
        x.IntergrationCode == this.itemFactory.IntergrationCode
    );

    if (ifExits == null) {
      this.entity.ItemFactory.push(
        JSON.parse(JSON.stringify(this.itemFactory))
      );
    } else {
      this.toastr.warning("Validate", "Factory đã tồn tại");
    }
  }

  validateFactory(factoryId, code) {
    if (factoryId == null || code == null || factoryId == "" || code == "") {
      return false;
    }
    return true;
  }

  fnDeleteFactory(index) {
    this.entity.ItemFactory.splice(index, 1);
  }

  ////////// Area Item Property //////////////////
  loadProperty() {
    const modelItemType = new DataTablePaginationParram();
    modelItemType.key = "";
    modelItemType.entity = "";
    modelItemType.keyFields = "";
    modelItemType.selectFields = "";
    modelItemType.page = 1;
    modelItemType.pageSize = 9999;
    modelItemType.orderDir = "Asc";
    modelItemType.orderBy = "";

    this.api
      .getItemTypePaginationByCode(modelItemType, this.code)
      .subscribe(res => {
        let result = res as any;
        this.listProperty = result.result;

        this.listProperty.unshift({ id: 0, text: "Please select property" });
      });
  }

  itemPropertyChange(item) {
    if (item != null) this.itemProperty.ItemPropertyName = item.text;
  }

  fnAddProperty() {
    console.log(this.itemProperty);

    let isValidate = this.validateProperty(
      this.itemProperty.ItemTypePropertyId,
      this.itemProperty.ItemTypePropertyValue
    );

    //  kiểm tra nhập form
    if (!isValidate) {
      this.toastr.error("Validate", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    //  kiểm tra xem phần tử đã tồn tại trong mảng hay chưa
    let ifExist = this.entity.ItemProperty.find(
      x =>
        x.ItemTypePropertyId == this.itemProperty.ItemTypePropertyId &&
        x.ItemTypePropertyValue == this.itemProperty.ItemTypePropertyValue
    );

    if (ifExist == null) {
      this.entity.ItemProperty.push(
        JSON.parse(JSON.stringify(this.itemProperty))
      );
    } else {
      this.toastr.warning("Validate", "Property đã tồn tại");
    }
  }

  validateProperty(propertyId, val) {
    if (propertyId == null || val == null || propertyId == "" || val == "") {
      return false;
    }
    return true;
  }

  fnDeleteItemProperty(index) {
    this.entity.ItemProperty.splice(index, 1);
  }

  ////////// Area Item Unit //////////////////

  loadUnit() {
    const model = new DataTablePaginationParram();
    model.key = "";
    model.entity = "Unit";
    model.keyFields = "";
    model.selectFields = "UnitID,UnitName";
    model.page = 1;
    model.pageSize = 9999;
    model.orderDir = "Asc";
    model.orderBy = "UnitName";

    this.api.getUnitPagination(model).subscribe(res => {
      const result = res as any;
      this.listUnit = result.data.map(item => {
        return { id: item.UnitID, text: item.UnitName };
      });
    });
  }

  itemUnitChange(item) {
    if (item != null) this.itemPackage.ItemPackageUnitName = item.text;
  }

  fnAddPackage() {
    if (this.validatePackage()) {
      this.entity.ItemPackage.push(
        JSON.parse(JSON.stringify(this.itemPackage))
      );

      //this.itemPackage = new ItemPackage();
    } else {
      this.toastr.error("Validate", "Vui lòng nhập đầy đủ thông tin");
    }
  }

  validatePackage() {
    if (this.itemPackage.ItemPackageUnitId == 0) {
      return false;
    }
    if (
      this.itemPackage.ItemPackageCoefficient == null ||
      this.itemPackage.ItemPackageCoefficient <= 0
    ) {
      return false;
    }
    if (
      this.itemPackage.ItemPackageLength == null ||
      this.itemPackage.ItemPackageLength <= 0
    ) {
      return false;
    }
    if (
      this.itemPackage.ItemPackageWidth == null ||
      this.itemPackage.ItemPackageWidth <= 0
    ) {
      return false;
    }
    if (
      this.itemPackage.ItemPackageHeight == null ||
      this.itemPackage.ItemPackageHeight <= 0
    ) {
      return false;
    }
    if (
      this.itemPackage.ItemPackageWeight == null ||
      this.itemPackage.ItemPackageWeight <= 0
    ) {
      return false;
    }
    return true;
  }

  fnDeleteItemPackage(index) {
    this.entity.ItemPackage.splice(index, 1);
  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    if (this.listProperty.length > 0) {
      this.entity.ItemTypeId = this.listProperty[1].itemId;
    }
    let e = this.entity;
    if (this.ACTION_STATUS == "add") {
      e.CreateDate = new Date();
      e.CreateBy = this.auth.currentUser.Username;
    } else {
      e.ModifyDate = new Date();
      e.ModifyBy = this.auth.currentUser.Username;
    }

    console.log("send entity: ", e);
    if (this.ACTION_STATUS == "add") {
      if (await this.fnValidate(e)) {
        this.api.addItem(e).subscribe(
          res => {
            let operationResult: any = res;
            if (operationResult.Success) {
              this.toastr.success(this.trans.instant("messg.add.success"));
            } else {
              this.toastr.warning(operationResult.Message);
            }
            this.laddaSubmitLoading = false;

            this.loadInit();
            this.resetEntity();
            $("#myModal4").modal("hide");
          },
          err => {
            this.toastr.error(err.statusText);
            this.laddaSubmitLoading = false;
          }
        );
      } else {
        this.toastr.warning("Validate", "Tên hóa chất đã tồn tại");
      }
    }
    if (this.ACTION_STATUS == "update") {
      this.api.updateItem(e).subscribe(
        res => {
          let operationResult: any = res;
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          } else {
            this.toastr.warning(operationResult.Message);
          }
          this.laddaSubmitLoading = false;
          this.loadInit();
          this.resetEntity();
          $("#myModal4").modal("hide");
        },
        err => {
          this.toastr.error(err.statusText);
          this.laddaSubmitLoading = false;
        }
      );
    }
  }
  private async fnValidate(e) {
    let result = !(await this.api
      .checkItemNameExist(this.entity.ItemName)
      .toPromise()
      .then());
    if (!result) {
      this.laddaSubmitLoading = false;
    }
    return result;
  }

  //=============>Area File<===========
  /** EVENT TRIGGERS */
  onSelect(event) {
    //drag file(s) or choose file(s) in ngFileZone
    console.log(event);
    // this.files.push(...event.addedFiles); //refresh showing in Directive
    if (event.rejectedFiles.length > 0) {
      this.toastr.warning(this.trans.instant("messg.maximumFileSize5000"));
    }
    for (var index in event.addedFiles) {
      let item = event.addedFiles[index];
      let currentFile = this.files;
      var _existIndex = currentFile.filter(x => x.name == item.name).length;
      if (_existIndex > 0) this.files.splice(_existIndex - 1, 1);
      else {
        let _itemFile = new ItemFile();
        _itemFile.File.FileOriginalName = item.name;
        _itemFile.File.FileLocalName = this.helper.getFileNameWithExtension(item);
        _itemFile.File.Path = this.pathFile + "/" + item.name;
        this.entity.ItemFile.push(_itemFile);
      }
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.uploadFile(event.addedFiles);
  }

  onRemove(event) {
    //press x to delte file (in modal)
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.ItemFile.splice(index, 1);
    // this.removeFile(event);
  }

  private uploadFile(files: File[]) {
    //upload file to server
    let formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    this.api
      .uploadFile(formData, this.pathFile)
      .subscribe(res => console.log(res));
  }

  downloadFile(filename) {
    //press File to download (in modal)
    this.api.downloadFile(this.pathFile + "/" + filename);
  }
}
