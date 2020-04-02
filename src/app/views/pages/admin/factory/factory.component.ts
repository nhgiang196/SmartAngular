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
  @ViewChild(SmartUploadComponent, { static: true }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', {static: true}) targetForm : DxFormComponent;
  @ViewChild('targetValidate', {static: true}) targetValidate : DxValidatorComponent;
  constructor(
    private api: FactoryService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService,
    private auth: AuthService

  ) { }
  /** DECLARATION */
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', adaptivePosition: true };
  factory: Factory[] = []; //init data
  entity: Factory;
  tech_entity: FactoryTechnology;
  laddaSubmitLoading = false;
  iboxloading = false;
  newTechnology: FactoryTechnology;
  keyword: string = '';
  pathFile = "uploadFilesFactory";
  ACTION_STATUS: string;
  factory_showed = 0;
  invalid: any = { FactoryCodeNull: false, FactoryCodeExist: false, FactoryNameNull: false, FactoryNameExist: false };
  EditRowNumber: number = 0;
  pageIndex = 1;
  pageSize = 12;
  isFormValid = true;

  buttonOptions: any = {
    text: "Register",
    type: "success",
    useSubmitBehavior: true
}


  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  /**INIT FUNCTIONS */
  loadInit() {
    this.iboxloading = true;
    this.EditRowNumber = 0;
    
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
    this.tech_entity = new FactoryTechnology();
    this.newTechnology = new FactoryTechnology();
    this.invalid = {};
    this.EditRowNumber = 0;
    this.isFormValid = true;
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
    this.isFormValid = true;
    $("#myModal4").modal('hide');
    if (id == null) { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.getFactoryById(id).subscribe(res => {
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      /**CONTROL FILES */
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
  async fnAddItem(itemAdd) { //press add item (in modal)
    let _checkValidate = await this.validateItem(itemAdd, -1)
    if (!_checkValidate) return;
    else this.entity.FactoryTechnology.push(itemAdd);
    this.newTechnology = new FactoryTechnology();
  }
  async fnSaveItem(itemAdd, index) { //press add item (in modal)
    let _checkValidate = await this.validateItem(itemAdd, index)
    if (!_checkValidate) return;
    this.entity.FactoryTechnology.splice(index, 1, itemAdd);
    this.tech_entity = new FactoryTechnology();

  }


  async validateItem(itemAdd: FactoryTechnology, index) {
    // if (itemAdd.TechnologyName == null) {
    //   swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'), 'warning');
    //   return false;
    // }

    //Check validate date from biger than date to
    if (itemAdd.TechnologyFromDate > itemAdd.TechnologyToDate) {
      swal.fire(
        {
          title: this.trans.instant('messg.validation.caption'),
          titleText: this.trans.instant('Factory.mssg.ErrorTechnologyDateToLessThanDateFrom'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'error',
        }
      );
      return false;
    }

    for (const i in this.entity.FactoryTechnology) {
      let t = this.entity.FactoryTechnology[i];
      if (index.toString() === i) continue;
      if (t.TechnologyName.toLowerCase().trim() === itemAdd.TechnologyName.toLowerCase().trim()) {
        swal.fire(
          {
            title: this.trans.instant('messg.validation.caption'),
            titleText: this.trans.instant('Factory.mssg.ErrorDuplicateTechnology'),
            confirmButtonText: this.trans.instant('Button.OK'),
            type: 'error',
          }
        );
        return false;
      }

      if ((itemAdd.TechnologyFromDate >= t.TechnologyFromDate && itemAdd.TechnologyFromDate <= t.TechnologyToDate)
        || (itemAdd.TechnologyToDate >= t.TechnologyFromDate && itemAdd.TechnologyToDate <= t.TechnologyToDate)
        || (itemAdd.TechnologyFromDate <= t.TechnologyFromDate && itemAdd.TechnologyToDate >= t.TechnologyToDate)) {
        swal.fire(
          {
            title: this.trans.instant('messg.validation.caption'),
            titleText: this.trans.instant('Factory.mssg.ErrorTechnologyValidateOverlap'),
            confirmButtonText: this.trans.instant('Button.OK'),
            type: 'error',
          });
        return false;
      }
    }

    this.EditRowNumber = 0;
    return true
  }


  fnEditItem(index) { //press edit item (in modal)
    this.EditRowNumber = index + 1;
    this.tech_entity = new FactoryTechnology();
    this.tech_entity = Object.assign({}, this.entity.FactoryTechnology[index]); //stop binding
  }
  fnDeleteItem(index) { //press delete item (in modal)
    this.entity.FactoryTechnology.splice(index, 1);
  }
  async fnSave() { //press save/SUBMIT button
    this.laddaSubmitLoading = true;
    var e = this.fnConvertFactoryDate(this.entity);
    if (await this.fnValidate(e)) {
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
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
      if (this.ACTION_STATUS == 'update') {
        this.api.updateFactory(e).subscribe(res => {
          var operationResult: any = res
          if (operationResult.Success) {
            this.loadInit();
            this.toastr.success(this.trans.instant("messg.update.success"));
          }
          else this.toastr.warning(operationResult.Message);
          this.laddaSubmitLoading = false;
        }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
      }
    }
  }
  /** EVENT TRIGGERS */
  onSwitchStatus() { //modal switch on change
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
    if (this.entity.Status == 1) this.entity.FactoryEndDate = null;
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
  private async fnValidate(e: Factory) { //validate entity
    this.invalid = {};
    let result = await this.api.validateFactory(e).toPromise().then().catch(err => {
      this.laddaSubmitLoading = false;
      this.toastr.warning(err.statusText, 'Validate Got Error');
    }) as any;
    if (!result.Success) {
      this.laddaSubmitLoading = false;
      this.invalid[result.Message] = true;
      return false;
    }
    return true;
  }
  private fnCheckBeforeEdit(id) { //un done
    this.toastr.warning("User not dont have permission");
  }
  receiveElementFile(event: UI_CustomFile[]) {
    console.log('receiveComponent', event);
    this.entity.FactoryFile = event;
    console.log('after Map', this.entity.FactoryFile);
  }

  validateFunction =  (e) => {
    
    switch (e.formItem.dataField) {
      case "FactoryEndDate": return  this.entity.FactoryStartDate<= e.value
      default: return true;
    }
    
  };

  // checkValidate(e = null){
  //   let validateRes = this.targetForm.instance.validate();  
  //   this.isFormValid =  validateRes.isValid;
  //   // return !validateRes.isValid;
  // }

  ngAfterViewInit() { //CSS
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }

  /*
  FactoryAddress
  FactoryContact
  FactoryContactPhone
  FactoryType
  Status
 
  'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async'

  */
}
