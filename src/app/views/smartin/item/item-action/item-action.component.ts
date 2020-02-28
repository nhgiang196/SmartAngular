import { Component, OnInit } from "@angular/core";
import {
  Item,
  ItemFactory,
  ItemProperty,
  ItemPackage,
  DataTablePaginationParram,
  ItemFile
} from "src/app/models/SmartInModels";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import { MyHelperService } from "src/app/services/my-helper.service";
import { Router, ActivatedRoute } from "@angular/router";
import { map, distinctUntilChanged, tap, switchMap, catchError } from "rxjs/operators";
import swal from 'sweetalert2';
import { Select2OptionData } from 'ng2-select2';
import { of, concat, Observable, Subject } from 'rxjs';

@Component({
  selector: "app-item-action",
  templateUrl: "./item-action.component.html",
  styleUrls: ["./item-action.component.css"]
})
export class ItemActionComponent implements OnInit {
  code: string = "HC";
  private pathFile = "uploadFilesItem"

  itemIdPram: any = null;
  entity: Item = new Item();
  itemFactory: ItemFactory = new ItemFactory();
  itemProperty: ItemProperty = new ItemProperty();
  itemPackage: ItemPackage = new ItemPackage();

  //listFactory: any = [];
  // listProperty: any = [];
  // listUnit: any = [];

  laddaSubmitLoading = false;
  files: File[] = [];
  addFiles : {FileList : File[], FileLocalNameList: string[]};

    listFactory: Observable<any>;
    listUnit: Observable<any>;
    listProperty:Observable<any>;

    factoryInput$ = new Subject<string>();
    unitInput$ = new Subject<string>();
    propertyInput$ = new Subject<string>();


  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    public helper: MyHelperService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.addFiles = { FileList: [], FileLocalNameList : []};
    // this.propertyInput$ =null;
    this.propertyInput$.next('Th');
    this.loadFactory();
    this.loadProperty();
    // this.loadUnit();
    this.itemIdPram = this.route.snapshot.params.id;

    var listItem = this.route.snapshot.data["item"];
    if (listItem != null) {
      console.log(listItem)
      this.listUnit = [{id:listItem.ItemUnit.UnitId, text:listItem.ItemUnit.UnitName }] as any;
      // this.entity = listItem;
      //this.customData();
    }
  }


  async fnSave() {
    this.laddaSubmitLoading = true;
    // if (this.listProperty.length > 0) {
    //   this.entity.ItemTypeId = this.listProperty[1].itemId;
    // }

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
            this.uploadFile(this.addFiles.FileList);
            this.router.navigate(['/category/item']);
          },
          err => {
            this.toastr.error(err.statusText);
            this.laddaSubmitLoading = false;
          }
        );
      } else {
        this.toastr.warning("Validate", "Tên hóa chất đã tồn tại");
      }
    } else {
      this.api.updateItem(e).subscribe(
        res => {
          let operationResult: any = res;
          if (operationResult.Success) {
            this.toastr.success(this.trans.instant("messg.update.success"));
          } else {
            this.toastr.warning(operationResult.Message);
          }
          this.laddaSubmitLoading = false;
          this.uploadFile(this.addFiles.FileList);
          this.router.navigate(['/category/item']);
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

  customData() {
    //Custom factory
    // this.entity.ItemFactory.map(itemFactory => {
    //   let findNameFactory = this.listFactory.find(
    //     item => item.id == itemFactory.FactoryId
    //   );
    //   if (findNameFactory != null) {
    //     itemFactory.FactoryName = findNameFactory.text;
    //     return itemFactory;
    //   }
    // });
    // //Custom property
    // this.entity.ItemProperty.map(itemProperty => {
    //   let findNameProperty = this.listProperty.find(
    //     item => item.id == itemProperty.ItemTypePropertyId
    //   );
    //   if (findNameProperty != null) {
    //     itemProperty.ItemPropertyName = findNameProperty.text;
    //     return itemProperty;
    //   }
    // });

    // //Custom Package
    // this.entity.ItemPackage.map(itemPackage => {
    //   let findNamePackage = this.listUnit.find(
    //     item => item.id == itemPackage.ItemPackageUnitId
    //   );
    //   if (findNamePackage != null) {
    //     itemPackage.ItemPackageUnitName = findNamePackage.text;
    //     return itemPackage;
    //   }
    // });

    /**CONTROL FILES */
    this.entity.ItemFile.forEach(item =>{
      let _tempFile = new File([],item.File.FileLocalName);
      this.files.push(_tempFile);
    })
    this.entity.ModifyBy = this.auth.currentUser.Username;
    this.files.push();
  }

  ////////////// Area Func Factory///////////////

  
  private loadFactory() {
    this.listFactory = concat(
        of([]), // default items
        this.factoryInput$.pipe(
            distinctUntilChanged(),
            switchMap(term =>
               this.api.getFactoryToSelect2(term).pipe(
                map(res=>{
                  return res.result.map(item=>{
                    return {id: item.FactoryID,text:item.FactoryName}
                  })
                }),
                catchError(() => of([]))
                )
            
            )
        )
    );
  }

  factoryChange(item) {
    this.itemFactory.FactoryId =item.value;
    if (item.data.length > 0) this.itemFactory.Factory.FactoryName = item.data[0].text;
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

loadProperty(){
  this.listProperty = concat(
    of([]), // default items
    this.propertyInput$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
           this.api.getItemTypeToSelect2(term,this.code).pipe(
            map(res=>{
              return res.result;
            }),
            catchError(() => of([]))
            )
        
        )
    )
);
}

  itemPropertyChange(item) {
    this.itemProperty.ItemTypePropertyId =item.value;
    if (item.data.length > 0) this.itemProperty.ItemTypePropertyValue = item.data[0].text;
  }

  fnAddProperty() {
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

  private async loadUnit() {
  //  this.listUnit =await concat(of([{id:1,text:"ac"}]));
  //   this.entity.ItemUnitId =1;

    this.listUnit = concat(
        of([]), // default items
        this.unitInput$.pipe(
            distinctUntilChanged(),
            switchMap(term =>
               this.api.getUnitSelect2(term).pipe(
                map(res=>{
                  return res.result.map(item=>{
                    return {id: item.UnitID,text:item.UnitName}
                  })
                }),
                catchError(() => of([]))
                )
            )
        )
    );
  }

  itemUnitChange(item,isSetId=false) {
    if(isSetId)
      {
        this.entity.ItemUnitId =item.value;
      }
    this.itemPackage.ItemPackageUnitId =item.value;
    if (item.data.length > 0) this.itemPackage.ItemPackageUnit.UnitName = item.data[0].text;
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


  ////////////////File ////////////
  onRemove(event) { //press x to delte file (in modal)
    console.log(event);
    let index = this.files.indexOf(event);
    this.files.splice(index, 1); //UI del
    this.entity.ItemFile.splice(index,1);
    // this.removeFile(event);
  }
  downloadFile(filename){ 
    this.api.downloadFile(this.pathFile+'/'+filename);
  }

  private uploadFile(files: File[]){ //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.api.uploadFile(formData, this.pathFile).subscribe(res=> console.log(res),err=>this.toastr.warning(err.statusText,'Upload file bị lỗi'));
  }


  /** EVENT TRIGGERS */
  async onSelect(event) { //drag file(s) or choose file(s) in ngFileZone
    var askBeforeUpload = false;
    if (event.rejectedFiles.length>0) this.toastr.warning(this.trans.instant('messg.maximumFileSize5000'));
    var _addFiles = event.addedFiles;
    for (var index in _addFiles) {
      let item = event.addedFiles[index];
      let convertName = this.helper.getFileNameWithExtension(item);
      let currentFile = this.files;
      let  findElement =  currentFile.filter(x=>x.name == item.name)[0];
      //ASK THEN GET RESULT
      if (findElement!=null) {
        if (!askBeforeUpload) {
          askBeforeUpload = true;
          var allowUpload =true;
          await swal.fire({
            title: 'File trùng',
            titleText: 'Một số file bị trùng, bạn có muốn đè các file này lên bản gốc?',
            type: 'warning',
            showCancelButton: true,
            reverseButtons: true
            }).then((result) => {
               if (result.dismiss === swal.DismissReason.cancel) allowUpload = false;
            })
        }
        if (!allowUpload)  return;
        this.files.splice( this.files.indexOf(findElement,0),1 );
        this.addFiles.FileList.splice(this.addFiles.FileList.indexOf(findElement,0),1 );
        
      }
      else{
        
      debugger;
        let _ItemFile = new ItemFile();
        _ItemFile.File.FileOriginalName= item.name;
        _ItemFile.File.FileLocalName = convertName;  
        _ItemFile.File.Path = this.pathFile + '/' + convertName;
        _ItemFile.File.FileType = item.type;
        this.entity.ItemFile.push(_ItemFile);
        this.addFiles.FileLocalNameList.push(convertName);
      }
      
    }
    this.files.push(...event.addedFiles); //refresh showing in Directive
    this.addFiles.FileList.push(...event.addedFiles);
    // this.uploadFile(event.addedFiles);
    
    
    
  }

  ngAfterViewInit(){
    this.entity=this.route.snapshot.data["item"];
  }


}
