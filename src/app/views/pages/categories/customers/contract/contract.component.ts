import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collapseIboxHelper } from 'src/app/app.helpers';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent, ModalDirective } from 'ngx-bootstrap';
declare let $: any;
import swal from 'sweetalert2';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { AuthService, ContractService } from 'src/app/core/services';
import { Contract, ContractPrice, ContractBreach } from 'src/app/core/models/contrack';
import { DxFormComponent } from 'devextreme-angular';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit, AfterViewInit {
  @ViewChild('contractFile', { static: true }) uploadComponent: SmartUploadComponent;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @Input('contractid') contractId: number;
  @Output('contract') send_entity = new EventEmitter<Contract>();
  constructor(
    private api: ContractService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public trans: TranslateService,
    private auth: AuthService
  ) {
  }
  breachTypeList: any = [
    { id: 1, text: this.trans.instant('Contract.data.ContractBreach.BreachType1') }
    , { id: 2, text: this.trans.instant('Contract.data.ContractBreach.BreachType2') }
  ];
  resolveTypeList: any = [
    { id: 1, text: this.trans.instant('Contract.data.ContractBreach.ResolveType1') }
    , { id: 2, text: this.trans.instant('Contract.data.ContractBreach.ResolveType2') }
  ];
  pathFile = 'uploadFileContract'
  entity: Contract;
  laddaSubmitLoading = false;
  iboxloading = false;
  ngOnInit() {
  }
  loadInit(id) {
    this.targetForm.instance.resetValues();
    this.uploadComponent.resetEntity();
    if (id && id != 0) {
      this.iboxloading = true;
      this.api.findById(id).subscribe(res => {
        this.childModal.show();
        this.targetForm.instance.updateData(res);
        this.uploadComponent.loadInit((res as any).ContractFile);
        this.iboxloading = false;
      }, err => {
        this.toastr.error(err.statusText, "Load contract failed! Check your connection");
        this.iboxloading = false;
      })
    }
    else {
      this.targetForm.instance.updateData(new Contract());
    }
  }
  async resetEntity() { 
    this.entity = new Contract();
    this.entity.CustomerId = this.route.snapshot.params.id || 0;
  }
  async fnSave() {
    if (! await this.targetForm.instance.validate().isValid) return;
    var e = this.entity;
    await this.uploadComponent.uploadFile();
    if (e.CustomerId == 0) { //New customer, just send to parrent
      let _sendParent = Object.assign({}, e); //stop binding
      this.send_entity.emit(_sendParent);
      this.childModal.hide();
    }
    else if (e.ContractId == 0) //add
    {
      e.CreateBy = this.auth.currentUser.Username;
      let operationResult = await this.api.add(e).then().catch(err => this.toastr.error(err.statusText, 'Network')) as any;
      if (operationResult.Success) {
        this.toastr.success(this.trans.instant("messg.add.success"));
        this.entity.ContractId = operationResult.Data; //ID return;
        this.childModal.hide();
        this.sendtoParentView(this.entity);
      }
      else this.toastr.warning(operationResult.Message);
    }
    else { //update
      e.ModifyBy = this.auth.currentUser.Username;
      let operationResult = await this.api.update(e).then().catch(err => this.toastr.error(err.statusText, 'Network')) as any;
      if (operationResult.Success) {
        this.toastr.success(this.trans.instant("messg.update.success"));
        this.childModal.hide();
        this.sendtoParentView(this.entity);
      }
      else this.toastr.warning(operationResult.Message);
    }
  }
  private sendtoParentView(e: Contract) {
    let _sendParent = Object.assign({}, e); //stop binding
    delete _sendParent.ContractBreach;
    delete _sendParent.ContractPrice;
    delete _sendParent.ContractFile;
    this.send_entity.emit(_sendParent);
    this.childModal.hide();
  }
  validateFunction = (e) => {
    if (e.formItem)
      switch (e.formItem.dataField) {
        case "StandardType": return (e.value != null && e.value!=0)
        case "ContractEffectiveDate": return (e.value <= this.entity.ContractEndDate) || this.entity.ContractEndDate == null
        case "ContractEndDate": return (this.entity.ContractEffectiveDate <= e.value) || this.entity.ContractEffectiveDate == null
      }
    if (e.column) { 
      switch (e.column.dataField) {
        case "WaterFlow":
          let _find = this.entity.ContractPrice.find(x => x.WaterFlow == e.data.WaterFlow);
          if (!_find) return true;
          else if (_find.Currency == e.data.Currency
            && _find.Price == e.data.Price
            && _find.Tax == e.data.Tax) return true;
          else return false;
      }
    }
    return true;
  };
  validateAsync = (e) => {
    return new Promise(async (resolve) => {
      this.laddaSubmitLoading = true;
      let obj = Object.assign({}, this.entity); //stop binding
      obj[e.formItem.dataField] = e.value;
      let _res = await this.api.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf(e.formItem.dataField) < 0;
      if (_validate == true) this.laddaSubmitLoading = false;
      resolve(_validate);
    });
  }
  onRowValidatingBreach(e){
    var itemAdd = e.newData as ContractBreach;
    for (const i in this.entity.ContractBreach) {
      let  item = this.entity.ContractBreach[i];
      if (item.Times== itemAdd.Times && item.BreachType == itemAdd.BreachType) {
        swal.fire(
          {
            title: this.trans.instant('messg.validation.caption'),
            titleText: this.trans.instant('Same Breach Type & Times'),
            confirmButtonText: this.trans.instant('Button.OK'),
            type: 'error',
          });
        e.isValid = false;
      }
    }
  }
  ngOnDestroy() {
    // this.childModal.hide();
  }
  ngAfterViewInit() {
    collapseIboxHelper();
  }
}
