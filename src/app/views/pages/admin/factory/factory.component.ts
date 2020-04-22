import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { FactoryService, AuthService } from 'src/app/core/services';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { Factory, FactoryTechnology } from 'src/app/core/models/factory';
import { UI_CustomFile } from 'src/app/core/models/file';
import swal from 'sweetalert2';
import { DxValidationGroupComponent, DxFormComponent, DxValidatorComponent } from 'devextreme-angular';
import { async } from '@angular/core/testing';
import { DxoGridComponent } from 'devextreme-angular/ui/nested';
declare let $: any;
@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css'],
})
export class FactoryComponent implements OnInit {
  @ViewChild('targetSmartUpload', { static: false }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild("targetGrid", { static: false }) targetGrid: DxoGridComponent;
  constructor(
    private api: FactoryService,
    private toastr: ToastrService,
    public trans: TranslateService,
    public helper: MyHelperService,
    private auth: AuthService
  ) {
    this.onFactoryDateChange = this.onFactoryDateChange.bind(this);
  }
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

  disabledEndDate = false;
  buttonOptions2 = {
    stylingMode: 'text', // để tắt đường viền container
    template: ` <button type="button" class="btn btn-white" data-dismiss="modal"> ${this.trans.instant('Button.Close')}</button>`, //template hoạt động cho Ispinia
  }

  buttonOptions = {
    stylingMode: 'text', // để tắt đường viền container
    template: `<button type="button" class="btn btn-primary"><i class="fa fa-paper-plane-o"></i> ${this.trans.instant('Button.Save')}</button>`, //template hoạt động cho Ispinia
    useSubmitBehavior: true, //submit = validate + save
  }
  statusOption = {
    displayExpr: 'text', valueExpr: 'id',
    items: [
      { id: 0, text: this.trans.instant('Factory.data.Status0') },
      { id: 1, text: this.trans.instant('Factory.data.Status1') }
    ],
    onValueChanged: (e) => {
      this.entity.FactoryEndDate = null;
      this.disabledEndDate = e.value == 1;

    }

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
      this.factory_showed = data.recordsTotal;
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
      this.disabledEndDate = res.Status == 1;
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
    if(e.FactoryContactPhone.length<=2) e.FactoryContactPhone= null;
    await this.uploadComponent.uploadFile();
    if (this.ACTION_STATUS == 'add') {
      this.api.add(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          $("#myModal4").modal('hide');
          this.loadInit();
          this.fnEditSignal(operationResult.Data);
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
    if (e.formItem){
      switch (e.formItem.dataField) {
        case "FactoryStartDate": return new Date(e.value) <= new Date(this.entity.FactoryEndDate) || this.entity.FactoryEndDate == null
        case "FactoryEndDate": return new Date(this.entity.FactoryStartDate) <= new Date(e.value) || this.entity.FactoryStartDate == null
      }
    }
      
    if (e.column) {
      switch (e.column.dataField) {
        case "TechnologyName":
          let _find = this.entity.FactoryTechnology.find(x => x.TechnologyName.toLowerCase().trim() == e.data.TechnologyName.toLowerCase().trim());
          if (!_find) return true;
          else if (_find.TechnologyDescription == e.data.TechnologyDescription
            && _find.TechnologyFromDate == e.data.TechnologyFromDate
            && _find.TechnologyToDate == e.data.TechnologyToDate) return true;
          else return false;
        case "TechnologyFromDate": return new Date(e.data.TechnologyFromDate) <= new Date(e.data.TechnologyToDate)
        case "TechnologyToDate": return new Date(e.data.TechnologyFromDate) <= new Date(e.data.TechnologyToDate)
      }
    }
    return true;
  };

  onFactoryDateChange(e) {
    this.targetForm.instance.validate();
  }

  validateAsync = (e) => {
    return new Promise(async (resolve) => {
      let obj = Object.assign({}, this.entity); //stop binding
      obj[e.formItem.dataField] = e.value;
      let _res = await this.api.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField) < 0;
      resolve(_validate);
    });
  }

  onRowInserted(){
    this.targetGrid.instance.addRow();
    this.targetGrid.instance.focus(this.targetGrid.instance.getCellElement(0,0))
  }

  onRowValidatingTechnology(e) {
    // e.oldData 
    // e.isValid = false;
    // swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
    var itemAdd = e.newData;
    for (const i in this.entity.FactoryTechnology) {
      let t = this.entity.FactoryTechnology[i];
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
        e.isValid = false;
      }
    }


  }

  ngOnDestroy() {
    $('.modal').modal('hide');
  }
}
