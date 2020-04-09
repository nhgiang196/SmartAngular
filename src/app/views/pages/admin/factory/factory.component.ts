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
})
export class FactoryComponent implements OnInit {
  @ViewChild('targetSmartUpload', { static: false }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
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
  private resetEntity() {
    this.entity = new Factory();
  }
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
  fnSearchLoad() {
    this.pageIndex = 1;
    this.loadInit();
  }
  fnAdd() { 
    this.ACTION_STATUS = 'add';
    this.targetForm.instance.resetValues();
    this.resetEntity();
    this.uploadComponent.resetEntity();
    this.entity.CreateBy = this.auth.currentUser.Username;
  }
  fnEditSignal(id) {
    $("#myModal4").modal('hide');
    if (id == null) { this.toastr.warning('Factory ID is Null, cant show modal'); return; }
    this.ACTION_STATUS = 'update';
    this.iboxloading = true;
    this.api.findById(id).subscribe(res => {
      this.entity = res;
      $("#myModal4").modal('show');
      this.iboxloading = false;
      this.uploadComponent.loadInit((res as any).FactoryFile);
      this.entity.ModifyBy = this.auth.currentUser.Username;
    }, error => {
      this.iboxloading = false;
      this.toastr.error(error.statusText, "Load factory information error");
    })
  }
  fnDelete(id) { 
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
          this.api.remove(id).then(res => {
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
  async fnSave() {
    // var e = this.fnConvertFactoryDate(this.entity);
    var e = this.entity;
    await this.uploadComponent.uploadFile();
    if (this.ACTION_STATUS == 'add') {
      this.api.add(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
          this.loadInit();
        }
        else this.toastr.warning(operationResult.Message);
      }, err => { this.toastr.error(err.statusText); })
    }
    if (this.ACTION_STATUS == 'update') {
      this.api.update(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.loadInit();
          this.toastr.success(this.trans.instant("messg.update.success"));
        }
        else this.toastr.warning(operationResult.Message);
      }, err => { this.toastr.error(err.statusText); })
    }
  }
  onPageChanged(event: PageChangedEvent): void {
    this.pageIndex = event.page;
    this.loadInit();
  }
  validateFunction = (e) => {
    if (e.formItem)
      switch (e.formItem.dataField) {
        case "FactoryStartDate": return e.value <= this.entity.FactoryEndDate
        case "FactoryEndDate": return this.entity.FactoryStartDate <= e.value
      }
    if (e.column) { }
    switch (e.column.dataField) {
      case "TechnologyName": return this.entity.FactoryTechnology.filter(x => x.TechnologyName == e.data.TechnologyName && x.FactoryTechnologyId != e.data.FactoryTechnologyId).length == 0
      case "TechnologyFromDate": return e.data.TechnologyFromDate <= e.data.TechnologyToDate
      case "TechnologyToDate": return e.data.TechnologyFromDate <= e.data.TechnologyFromDate
    }
    return true;
  };
  validateAsync = (e) => {
    console.log('Validate Async', e)
    return new Promise(async (resolve) => {
      let obj = Object.assign({}, this.entity); //stop binding
      obj[e.formItem.dataField] = e.value;
      let _res = await this.api.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField) < 0;
      resolve(_validate);
    });
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
}
