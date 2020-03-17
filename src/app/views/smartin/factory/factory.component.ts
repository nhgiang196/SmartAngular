import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { collapseIboxHelper } from '../../../app.helpers';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Factory, FactoryTechnology, FactoryFile, Files, WarehouseLocation, UI_CustomFile, Item } from 'src/app/models/SmartInModels';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { MomentModule } from 'ngx-moment';
import { HttpEventType } from '@angular/common/http';
import { EventEmitter } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SmartUploadComponent } from '../ui-sample/smart-upload/smart-upload.component';
import { CONNREFUSED } from 'dns';
import { Action } from 'rxjs/internal/scheduler/Action';
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
  @ViewChild('myInputFile') InputManual: ElementRef; // set for emtpy file after Close or Reload
  @ViewChild(SmartUploadComponent) uploadComponent: SmartUploadComponent;
  constructor(
    private api: WaterTreatmentService,
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
  pageSize = 10;
  ngOnInit() {
    this.resetEntity();
    this.loadInit();
  }
  /**INIT FUNCTIONS */
  loadInit() {
    this.iboxloading = true;
    this.EditRowNumber = 0;
    this.api.getFactoryPaginationMain(this.keyword,this.pageIndex, this.pageSize).subscribe(res => {
      var data = res as any;
      this.factory = data.result;
      this.factory_showed = data.totalCount;
      this.iboxloading = false;
    }, err => {
      this.toastr.error(err.statusText, "Load init failed!");
      this.iboxloading = false;
    })
  }
  searchLoad(){
    this.pageIndex=1;
    this.loadInit();

  }
  private resetEntity() {
    this.entity = new Factory();
    this.tech_entity = new FactoryTechnology();
    this.newTechnology = new FactoryTechnology();
    this.invalid = {};
    this.EditRowNumber = 0;
  }
  /** BUTTON ACTIONS */
  fnAdd() { //press add buton
    this.ACTION_STATUS = 'add';
    this.resetEntity();
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) { //press a link name of entity
    $("#myModal4").modal('hide');
    if (id == null) { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.resetEntity();
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
            else{
              if((operationResult.Message.indexOf("The DELETE statement conflicted with the REFERENCE constraint")) > 0 )
              {
                swal.fire(
                  {
                    title: this.trans.instant('messg.delete.caption'),
                    titleText: this.trans.instant('The factory has arisen, cannot be deleted!'),
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
  async fnAddItem() { //press add item (in modal)
    let _checkValidate = await this.validateItem(this.newTechnology)
    if (!_checkValidate) return;
    this.entity.FactoryTechnology.push(this.newTechnology);
    this.newTechnology = new FactoryTechnology();
  }
  async validateItem(itemAdd: FactoryTechnology) {


    if (itemAdd.TechnologyName == null) {
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isnull'), 'warning');
      return false;
    }
    //Check validate date from biger than date to
    if(Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) > Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate))){
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant(' date from biger than date to!'), 'warning');
      return false;
    }

    //check duplicate technology Name
    console.log(this.entity.FactoryTechnology);
    var itemNew = this.entity.FactoryTechnology.filter(n =>{
      return n.isNew ==true;
    })
    console.log(itemNew);

    if(itemNew.filter(t=> {
      return t.TechnologyName.toLowerCase() == itemAdd.TechnologyName.toLowerCase();
    }).length>0){
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isexisted'), 'warning');
      return false;
    }
    console.log(itemNew);
      if(this.entity.FactoryTechnology.filter(t=> {
        return t.TechnologyName.toLowerCase() == itemAdd.TechnologyName.toLowerCase() && t.FactoryTechnologyId != itemAdd.FactoryTechnologyId ;
      }).length>0){
        swal.fire("Validate", this.trans.instant('Factory.data.TechnologyName') + this.trans.instant('messg.isexisted'), 'warning');
        return false;
      }

    //check nested validedate Date From To
    if(itemNew.filter(t=> {
      return  (Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate)))
              ||
              (Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate)))
              ||
              (Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate)))
    }).length>0){
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyDate') + this.trans.instant(' was nested validate'), 'warning');
      return false;
    }

    if(this.entity.FactoryTechnology.filter(t=> {
      return  (t.FactoryTechnologyId != itemAdd.FactoryTechnologyId )
              &&
              ((Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate)))
              ||
              (Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate)))
              ||
              (Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyFromDate)) <= Date.parse(this.helper.dateConvertToString(t.TechnologyFromDate))
              && Date.parse(this.helper.dateConvertToString(itemAdd.TechnologyToDate)) >= Date.parse(this.helper.dateConvertToString(t.TechnologyToDate))))
    }).length>0){
      swal.fire("Validate", this.trans.instant('Factory.data.TechnologyDate') + this.trans.instant(' was nested validate'), 'warning');
      return false;
    }
    this.EditRowNumber = 0;
    return true
  }
  fnEditItem(index) { //press edit item (in modal)
    this.EditRowNumber = index + 1;
    this.tech_entity = this.entity.FactoryTechnology[index];
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
            this.fnEditSignal(operationResult.Data);
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
  ngAfterViewInit() { //CSS
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
}
