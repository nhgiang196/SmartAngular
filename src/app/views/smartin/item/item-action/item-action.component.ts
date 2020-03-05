import { Component, OnInit } from "@angular/core";
import {
  Item,
  ItemFactory,
  ItemProperty,
  ItemPackage,
  DataTablePaginationParram,
  ItemFile,
  Unit,
  Factory,
  ItemType
} from "src/app/models/SmartInModels";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/services/auth.service";
import { MyHelperService } from "src/app/services/my-helper.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  map,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError
} from "rxjs/operators";
import swal from "sweetalert2";
import { Select2OptionData } from "ng2-select2";
import { of, concat, Observable, Subject } from "rxjs";
import { HttpEventType } from "@angular/common/http";
import { Identifiers, identifierModuleUrl, ThrowStmt } from "@angular/compiler";
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { async } from '@angular/core/testing';

@Component({
  selector: "app-item-action",
  templateUrl: "./item-action.component.html",
  styleUrls: ["./item-action.component.css"]
})
export class ItemActionComponent implements OnInit {
  code: string = "HC";
  private pathFile = "uploadFilesItem";
  minMode: BsDatepickerViewMode = 'year'
  bsConfig: Partial<BsDatepickerConfig>;

  itemIdPram: any = null;
  entity: Item = new Item();
  itemFactory: ItemFactory = new ItemFactory();
  listItemFactories: ItemFactory[] = [];
  itemProperty: ItemProperty = new ItemProperty();
  itemPackage: ItemPackage = new ItemPackage();

  //For add new records
  newItemFactory: ItemFactory = new ItemFactory();
  newItemPackage: ItemPackage = new ItemPackage();
  newItemProperty: ItemProperty = new ItemProperty();

  //set rowEdit
  editRowId: number = 0;

  uploadReportProgress: any = { progress: 0, message: null, isError: null };
  laddaSubmitLoading = false;
  files: File[] = [];
  fileImages: File[] = [];

  listImages: Array<ItemFile> = new Array<ItemFile>();
  listFiles: Array<ItemFile> = new Array<ItemFile>();

  addFiles: { FileList: File[]; FileLocalNameList: string[] };

  listFactory: any;
  listUnit: any;
  listProperty: any;
  listItemType: Array<ItemType>= new Array<ItemType>();

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
    this.bsConfig = Object.assign({}, {
      minMode : this.minMode,
      dateInputFormat: 'YYYY' ,
       adaptivePosition: true
    });
    this.addFiles = { FileList: [], FileLocalNameList: [] };
    await this.loadFactory();
    
    await this.loadUnit();
    await this.getAllItemType();

    this.itemIdPram = this.route.snapshot.params.id;
    var item = this.route.snapshot.data["item"] as Item;
    if (item != null) {
      console.log(item);
      await this.changeItemType(item.ItemTypeId);
      this.entity = item;
      this.itemPackage.ItemPackageUnitId = 0;
      this.customFile();
    }
    else{
      this.entity.Status =1;
      this.loadProperty(this.code);
    }
  }


  async fnSave() {
    this.uploadReportProgress = { progress: 0, message: null, isError: null };
    this.laddaSubmitLoading = true;
    let e = this.entity;
    e.ItemManufactureYear =this.helper.yearConvertToString(new Date(e.ItemManufactureYear));

    if (this.itemIdPram == null) e.CreateBy = this.auth.currentUser.Username;
    else e.ModifyBy = this.auth.currentUser.Username;

    if (this.itemIdPram == null) {
     
      if (await this.fnValidate(e)) {
        this.api.addItem(e).subscribe(
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
            this.router.navigate(["/category/item/"+this.entity.ItemTypeId]);
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
      console.log(">>",this.entity)
      this.api.updateItem(e).subscribe(
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
          this.router.navigate(["/category/item/"+this.entity.ItemTypeId]);
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

  async getAllItemType(){
   this.listItemType =  await this.api.getItemType().pipe(map(res =>{
      return res as Array<ItemType>;
    })).toPromise().then();
  }

   async changeItemType(valIdCode){
    var idCode = this.listItemType.find(x=>x.ItemTypeId ==valIdCode).ItemTypeCode;
    await this.loadProperty(idCode);
  }

  onSwitchStatus (){ //modal switch on change
    this.entity.Status = this.entity.Status==0? 1: 0;
 }


  ////////////// Area Func Factory///////////////

  // private loadFactory() {
  //   this.listFactory = concat(
  //       of([]), // default items
  //       this.factoryInput$.pipe(
  //           distinctUntilChanged(),
  //           switchMap(term =>
  //              this.api.getFactoryToSelect2(term).pipe(
  //               map(res=>{
  //                 return res.result.map(item=>{
  //                   return {id: item.FactoryID,text:item.FactoryName}
  //                 })
  //               }),
  //               catchError(() => of([]))
  //               )

  //           )
  //       )
  //   );
  // }

  private async loadFactory() {
    const model: DataTablePaginationParram = {
      key: "",
      entity: "Factory",
      keyFields: "",
      selectFields: "FactoryName,FactoryId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "FactoryName"
    };
    // this.listFactory = await this.api.getAllFactoryPagination(model).pipe(
    //   map(res => {
    //     var ress = res as any;
    //     return ress.result.map(item => {
    //       return { id: item.FactoryId, text: item.FactoryName };
    //     })
    //   })).toPromise().then();

    let data: any = await this.api
      .getAllFactoryPagination(model)
      .toPromise()
      .then();
    this.listFactory = data.result;
    console.log(this.listFactory);
  }

  factoryChange(item) {
    this.itemFactory.FactoryId = item.id;
    this.itemFactory.FactoryName = item.text;
  }

  ////////// Area Item Property //////////////////

  // loadProperty(){
  //   this.listProperty = concat(
  //     of([]), // default items
  //     this.propertyInput$.pipe(
  //         distinctUntilChanged(),
  //         switchMap(term =>
  //            this.api.getItemTypeToSelect2(term,this.code).pipe(
  //             map(res=>{
  //               return res.result;
  //             }),
  //             catchError(() => of([]))
  //             )

  //         )
  //     )
  // );
  // }

  //add list
  //factories
  fnAddFactory() {
    if (!this.isExistFactory())
      this.entity.ItemFactory.push(this.newItemFactory);
      else{
        this.toastr.warning("Dữ liệu đã tồn tại");
      }
    this.newItemFactory = new ItemFactory();
  }
  fnEditFactory(index) {
    this.editRowId = index + 1;
    this.itemFactory = this.entity.ItemFactory[index];
  }
  fnDeleteFactory(index) {
    this.entity.ItemFactory.splice(index, 1);
  }
  isExistFactory() {
    return this.entity.ItemFactory.find(
      x =>
        x.FactoryId == this.newItemFactory.FactoryId &&
        x.IntergrationCode == this.newItemFactory.IntergrationCode
    );
  }

  //properties
  fnAddProperty() {
    console.log(this.newItemProperty)
    if (!this.isExistProperty())
      this.entity.ItemProperty.push(this.newItemProperty);
    else
      this.toastr.warning("Dữ liệu đã tồn tại");
    this.newItemProperty = new ItemProperty();
  }
  fnEditProperty(index) {
    this.editRowId = index + 1;
    this.itemProperty = this.entity.ItemProperty[index];
  }
  fnSaveProperty() {
    this.editRowId = 0;
  }
  fnDeleteProperty(index) {
    this.entity.ItemProperty.splice(index, 1);
  }

  isExistProperty() {
    console.log(this.entity.ItemProperty);
    return this.entity.ItemProperty.find(
      x =>
        x.ItemTypePropertyId == this.newItemProperty.ItemTypePropertyId &&
        x.ItemTypePropertyValue == this.newItemProperty.ItemTypePropertyValue
    );
  }

  //packages
  fnAddPackage() {
   if (!this.isExistPackage())
      this.entity.ItemPackage.push(this.newItemPackage);
      else{
        this.toastr.warning("Dữ liệu đã tồn tai");
      }
    this.newItemPackage = new ItemPackage();
  }
  fnEditPackage(index) {
    this.editRowId = index + 1;
    this.itemPackage = this.entity.ItemPackage[index];
  }
  fnSavePackage() {
    this.editRowId = 0;
  }
  fnDeletePackge(index) {
    this.entity.ItemPackage.splice(index, 1);
  }
  isExistPackage() {
    return this.entity.ItemPackage.find(
      x => x.ItemPackageUnitId == this.newItemPackage.ItemPackageUnitId
    );
  }

  async loadProperty(code) {
    const model: DataTablePaginationParram = {
      key: "",
      entity: "ItemType",
      keyFields: "",
      selectFields: "ItemTypeName,ItemTypeId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "ItemTypeName"
    }
    // this.listProperty = await this.api.getItemTypePaginationByCode(model, this.code).pipe(
    //   map(res => {
    //     var ress = res as any;
    //     return ress.result;
    //   })
    // ).toPromise().then();
     let data  = await this.api.getItemTypePaginationByCode(model,code).toPromise().then();
    this.listProperty = data.result;
    console.log(this.listProperty);
  }
  itemPropertyChange(item) {
    this.itemProperty.ItemTypePropertyId = item.id;
    this.itemProperty.ItemTypePropertyName = item.text;
  }

  ////////// Area Item Unit //////////////////

  // private async loadUnit() {
  // //  this.listUnit =await concat(of([{id:1,text:"ac"}]));
  // //   this.entity.ItemUnitId =1;

  //   this.listUnit = concat(
  //       of([{id:99,text:"aaa"}]), // default items
  //       this.unitInput$.pipe(
  //           distinctUntilChanged(),
  //           switchMap(term =>
  //              this.api.getUnitSelect2(term).pipe(
  //               map(res=>{
  //                 if(res!=null)
  //                 return res.result.map(item=>{
  //                   return {id: item.UnitID,text:item.UnitName}
  //                 })
  //               }),
  //               catchError(() => of([]))
  //               )
  //           )
  //       )
  //   );
  //   this.entity.ItemUnitId =99;
  // }

  private async loadUnit() {
    const model: DataTablePaginationParram = {
      key: "",
      entity: "Unit",
      keyFields: "",
      selectFields: "UnitName,UnitId",
      page: 1,
      pageSize: 9999,
      orderDir: "asc",
      orderBy: "UnitName"
    }

    // this.listUnit = await this.api.getUnitPagination(model).pipe(
    //   map(res => {
    //     return res.result.map(item => {
    //       return { id: item.UnitId, text: item.UnitName };
    //     })
    //   })).toPromise().then();

    // this.listUnit = concat(
    //     of([{id:99,text:"aaa"}]), // default items
    //     this.unitInput$.pipe(
    //         distinctUntilChanged(),
    //         switchMap(term =>
    //            this.api.getUnitSelect2(term).pipe(
    //             map(res=>{
    //               if(res!=null)
    //               return res.result.map(item=>{
    //                 return {id: item.UnitID,text:item.UnitName}
    //               })
    //             }),
    //             catchError(() => of([]))
    //             )
    //         )
    //     )
    // );
    // this.entity.ItemUnitId =99; 

    let data: any =  await this.api.getUnitPagination(model).toPromise().then();
    this.listUnit = data.result;
  }

  itemUnitChange(item, isSetId = false) {
    debugger;
    if (isSetId) {
      this.entity.ItemUnitId = item.id;
    }
    this.itemPackage.ItemPackageUnitId = item.id;
    this.itemPackage.UnitName = item.text;
  }

  ////////////////File ////////////
  onRemove(event, isImage) {
    debugger;
   const file = event as ItemFile;
    //press x to delte file (in modal)
    console.log(event);
    if (isImage) {
      let indexListImage = this.listImages.findIndex(x=>x.File.FileOriginalName == file.File.FileOriginalName);
      let indexListEntity = this.entity.ItemFile.findIndex(x=>x.IsImage==true && x.File.FileOriginalName == file.File.FileOriginalName);
      this.listImages.splice(indexListImage, 1); //UI del
      this.entity.ItemFile.splice(indexListEntity, 1);
    } else {
      let indexListImage = this.listFiles.findIndex(x=>x.File.FileOriginalName == file.File.FileOriginalName);
      let indexListEntity = this.entity.ItemFile.findIndex(x=>x.IsImage==false && x.File.FileOriginalName == file.File.FileOriginalName);
      this.listFiles.splice(indexListImage, 1); //UI del
      this.entity.ItemFile.splice(indexListEntity, 1);
    }

    // this.removeFile(event);
  }
  downloadFile(filename) {
    this.api.downloadFile(this.pathFile + "/" + filename);
  }

  private uploadFile(files: File[]) {
    //upload file to server
    let formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      let _file = files[index];
      formData.append("files", _file, this.addFiles.FileLocalNameList[index]);
    }
    this.api.uploadFile(formData, this.pathFile).subscribe(
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
      let findElement:ItemFile= null;
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
        if(isImage){
          let _indextFileEntity = this.entity.ItemFile.findIndex(x=>x.IsImage==true && x.File.FileOriginalName ==findElement.File.FileOriginalName);
          let _indextFileList = this.entity.ItemFile.filter(x=>x.IsImage==true).findIndex(x=> x.File.FileOriginalName ==findElement.File.FileOriginalName);
           //change file in entity
           this.listImages.splice(_indextFileList, 1);
          //  this.listImages =this.listImages.splice(1,1);
           this.addFiles.FileList.splice(_indextFileEntity, 1);
        }
        else{
          let _indextFileEntity = this.entity.ItemFile.findIndex(x=>x.IsImage==false && x.File.FileOriginalName ==findElement.File.FileOriginalName);
          let _indextFileList = this.entity.ItemFile.filter(x=>x.IsImage==false).findIndex(x=> x.File.FileOriginalName ==findElement.File.FileOriginalName);
           //change file in entity
           this.listImages.splice(_indextFileList, 1);
          //  this.listImages =this.listImages.splice(1,1);
           this.addFiles.FileList.splice(_indextFileEntity, 1);
        }
        // let _indexElement = this.entity.ItemFile.indexOf(findElement, 0);
        // if (isImage) this.fileImages.splice(_indexElement, 1);
        // else this.files.splice(_indexElement, 1);
        // this.addFiles.FileList.splice(_indexElement, 1);
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
    // if (isImage) this.fileImages.push(...event.addedFiles);
    // //refresh showing in Directive
    // else this.files.push(...event.addedFiles);
    if (isImage) {
      this.listImages = this.entity.ItemFile.filter(x => x.IsImage == true);
    } else {
      this.listFiles = this.entity.ItemFile.filter(x => x.IsImage == false);
    }
    this.addFiles.FileList.push(...event.addedFiles);
  }

  ngAfterViewInit() {
    //this.entity=this.route.snapshot.data["item"];
    //this.loadUnit();
  }
}
