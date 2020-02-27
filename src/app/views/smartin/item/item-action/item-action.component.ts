import { Component, OnInit } from '@angular/core';
import { Item, ItemFactory, ItemProperty, ItemPackage, DataTablePaginationParram } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-action',
  templateUrl: './item-action.component.html',
  styleUrls: ['./item-action.component.css']
})
export class ItemActionComponent implements OnInit {
  code: string = "HC";
  itemIdPram:any=null;
  entity: Item = new Item();
  itemFactory: ItemFactory = new ItemFactory();
  itemProperty: ItemProperty = new ItemProperty();
  itemPackage: ItemPackage = new ItemPackage();

  listFactory: any = [];
  listProperty: any = [];
  listUnit: any = [];

  laddaSubmitLoading = false;


  constructor( private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

 async ngOnInit() {
  console.log("1")

   await this.loadFactory();
    this.loadProperty();
    this.loadUnit();
     this.itemIdPram =  this.route.snapshot.params.id;

     var listItem= this.route.snapshot.data['item'];
     if(listItem!=null)
     {
       this.entity= listItem;
     }
  }

  async fnSave() {
    this.laddaSubmitLoading = true;
    if (this.listProperty.length > 0) {
      this.entity.ItemTypeId = this.listProperty[1].itemId;
    }


    let e = this.entity;
    if (this.itemIdPram == null) {
      e.CreateDate = new Date();
      e.CreateBy = this.auth.currentUser.Username;
    } else {
      e.ModifyDate = new Date();
      e.ModifyBy = this.auth.currentUser.Username;
    }

    console.log("send entity: ", e);
    if (this.itemIdPram == null) {
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
    else  {
      this.api.updateItem(e).subscribe(
        res => {
          let operationResult: any = res;
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          } else {
            this.toastr.warning(operationResult.Message);
          }
          this.laddaSubmitLoading = false;
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

  customData(){
 
      //Custom factory
      this.entity.ItemFactory.map(itemFactory => {
        debugger
        console.log(this.listFactory)
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
  }

    ////////////// Area Func Factory///////////////

    async  loadFactory() {
      const model = new DataTablePaginationParram();
      model.key = "";
      model.entity = "Factory";
      model.keyFields = "";
      model.selectFields = "FactoryID,FactoryName";
      model.page = 1;
      model.pageSize = 9999;
      model.orderDir = "Asc";
      model.orderBy = "FactoryName";

      await this.api.getAllFactoryPagination(model).subscribe(res => {
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
        this.listUnit = result.result.map(item => {
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


    }
