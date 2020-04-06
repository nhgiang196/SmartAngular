import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { FactoryService, AuthService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { Factory, FactoryTechnology } from 'src/app/core/models/factory';
import { UI_CustomFile } from 'src/app/core/models/file';
import swal from 'sweetalert2';
import { DxValidationGroupComponent, DxFormComponent, DxValidatorComponent } from 'devextreme-angular';
import { async } from '@angular/core/testing';
declare let $: any;
@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class FactoryComponent implements OnInit {
  @ViewChild('myInputFile', { static: true }) InputManual: ElementRef; // set for emtpy file after Close or Reload
  @ViewChild('targetSmartUpload', { static: false }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild('targetValidate', { static: true }) targetValidate: DxValidatorComponent;
  constructor(
    private api: FactoryService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService,
    private auth: AuthService
  ) { }
  /** DECLARATION */
  factory: Factory[] = []; //init data
  entity: Factory;
  iboxloading = false;
  keyword: string = '';
  pathFile = "uploadFilesFactory";
  ACTION_STATUS: string;
  factory_showed = 0;
  pageIndex = 1;
  pageSize = 12;
  buttonOptions: any = {
    stylingMode: 'text', // để tắt đường viền container
    template: `<button type="button" class="btn btn-primary"><i class="fa fa-paper-plane-o"></i>${this.trans.instant('Button.Save')}</button>`, //template hoạt động cho Ispinia
    useSubmitBehavior: true, //submit = validate + save
  }
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  /**INIT FUNCTIONS */
  loadInit() {
    this.iboxloading = true;
    this.api.getFactoryPaginationMain(this.keyword, this.pageIndex, this.pageSize).subscribe(res => {
      var data = res as any;
      this.factory = data.data;
      this.factory_showed = data.totalCount;
      this.iboxloading = false;
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    })
  }
  pageChanged(event: PageChangedEvent): void {
    this.pageIndex = event.page;
    this.loadInit();
  }
  searchLoad() {
    this.pageIndex = 1;
    this.loadInit();
  }
  private resetEntity() {
    this.entity = new Factory();
  }
  /** BUTTON ACTIONS */
  fnAdd() { //press add buton
    this.ACTION_STATUS = 'add';
    this.targetForm.instance.resetValues();
    this.resetEntity();
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) { //press a link name of entity
    $("#myModal4").modal('hide');
    if (id == null) { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.getFactoryById(id).subscribe(res => {
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      this.uploadComponent.loadInit(res.FactoryFile);
      this.entity.ModifyBy = this.auth.currentUser.Username;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) { //press X to delete entity
    swal.fire({
      title: this.trans.instant('Factory.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Factory.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.Yes'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          this.api.deleteFactory(id).subscribe(res => {
            var operationResult: any = res
            if (operationResult.Success) {
              swal.fire(
                // 'Deleted!', this.trans.instant('messg.delete.success'),
                {
                  title: this.trans.instant('messg.delete.caption'),
                  titleText: this.trans.instant('messg.delete.success'),
                  confirmButtonText: this.trans.instant('Button.OK'),
                  type: 'success',
                }
              );
              this.loadInit();
              $("#myModal4").modal('hide');
            }
            else {
              if ((operationResult.Message.indexOf("The DELETE statement conflicted with the REFERENCE constraint")) > 0) {
                swal.fire(
                  {
                    title: this.trans.instant('messg.validation.caption'),
                    titleText: this.trans.instant('Factory.mssg.ErrorFactoryArised'),
                    confirmButtonText: this.trans.instant('Button.OK'),
                    type: 'error',
                  }
                );
              }
              else this.toastr.warning(operationResult.Message);
            }
          }, err => { this.toastr.error(err.statusText) })
        }
      })
  }
  async fnSave() { //press save/SUBMIT button
    var e = this.fnConvertFactoryDate(this.entity);
    await this.uploadComponent.uploadFile();
    if (this.ACTION_STATUS == 'add') {
      this.api.addFactory(e).subscribe(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
          this.loadInit();
        }
        else this.toastr.warning(operationResult.Message);
        
      }, err => { this.toastr.error(err.statusText);  })
    }
    if (this.ACTION_STATUS == 'update') {
      this.api.updateFactory(e).subscribe(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.loadInit();
          this.toastr.success(this.trans.instant("messg.update.success"));
        }
        else this.toastr.warning(operationResult.Message);
        
      }, err => { this.toastr.error(err.statusText);  })
    }
    
  }
  /** PRIVATES FUNCTIONS */
  private fnConvertFactoryDate(e: Factory) {
    e.FactoryBuiltDate = this.helper.dateConvertToString(e.FactoryBuiltDate) as any;
    e.FactoryStartDate = this.helper.dateConvertToString(e.FactoryStartDate) as any;
    e.FactoryEndDate = this.helper.dateConvertToString(e.FactoryEndDate) as any;
    for (var index in e.FactoryTechnology) {
      e.FactoryTechnology[index].TechnologyFromDate = this.helper.dateConvertToString(e.FactoryTechnology[index].TechnologyFromDate) as any;
      e.FactoryTechnology[index].TechnologyToDate = this.helper.dateConvertToString(e.FactoryTechnology[index].TechnologyToDate) as any;
    }
    return e;
  }
  validateFunction = (e) => {
    if (e.formItem)
    switch (e.formItem.dataField) {
      case "FactoryStartDate": return e.value <=  this.entity.FactoryEndDate
      case "FactoryEndDate": return this.entity.FactoryStartDate <= e.value
      // case "TechnologyFromDate": return e.value <=  this.entity.FactoryTechnology.TechnologyToDate
      // case "TechnologyToDate": return this.entity.FactoryTechnology.TechnologyFromDate <= e.value
    }
    if (e.column){}
    switch (e.column.dataField) {
      case "TechnologyName": return this.entity.FactoryTechnology.filter(x=>x.TechnologyName==e.data.TechnologyName && x.FactoryTechnologyId != e.data.FactoryTechnologyId).length==0
      case "TechnologyFromDate": return e.data.TechnologyFromDate <=  e.data.TechnologyToDate
      case "TechnologyToDate": return e.data.TechnologyFromDate  <= e.data.TechnologyFromDate
    }
    return true;
  };

  validateAsync = (e) =>{ 
    console.log('Validate Async', e)
    // return true;
    return new Promise(async (resolve) => { 
      let obj = Object.assign({}, this.entity); //stop binding
      obj[e.formItem.dataField] = e.value;
      let _res =await this.api.validateFactory(obj).toPromise().then() as any;
      let _validate = _res.Success? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField)<0;
      resolve(_validate);
    });   

  }
  ngAfterViewInit() { //CSS
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
  /*
  Validate type:
  'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async'
  */
}
