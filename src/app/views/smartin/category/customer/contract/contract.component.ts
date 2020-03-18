import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contract, ContractPrice, ContractBreach, ContractFile } from 'src/app/models/SmartInModels';
import { collapseIboxHelper } from 'src/app/app.helpers';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MyHelperService } from 'src/app/services/my-helper.service';
import { AuthService } from 'src/app/services/auth.service';
declare let $: any;
import swal from 'sweetalert2';
import { trigger, transition, animate, style } from '@angular/animations';
import { SmartUploadComponent } from '../../../ui-sample/smart-upload/smart-upload.component';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      transition(':leave',
        animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class ContractComponent implements OnInit, AfterViewInit {
  @ViewChild('contractFile') uploadComponent: SmartUploadComponent;
  @Input('contractid') contractId: number;
  @Output('contract') send_entity = new EventEmitter<Contract>();
  constructor(
    private api: WaterTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private helper: MyHelperService,
    private trans: TranslateService,
    private auth: AuthService
  ) {
  }
  pathFile = 'uploadFileContract'
  entity: Contract;
  invalid: any = {};
  initCombobox = {};
  EditRowNumber = 0;
  EditRowNumber_PRICE = 0;
  laddaSubmitLoading = false;
  bsConfig = { dateInputFormat: 'YYYY-MM-DD', adaptivePosition: true };
  subEntity_ContractPrice: ContractPrice = new ContractPrice();
  newEntity_ContractPrice: ContractPrice = new ContractPrice();
  subEntity_ContractBreach: ContractBreach = new ContractBreach();
  newEntity_ContractBreach: ContractBreach = new ContractBreach();
  ngOnInit() {
  }
  ngOnDestroy() {
    $('.modal').modal('hide');
  }
   async resetEntity() { //reset entity values
    
    this.entity = new Contract();
    this.entity.CustomerId = this.route.snapshot.params.id || 0;
    this.invalid = { Existed_ContractNo: false };
    this.EditRowNumber = 0;
    this.EditRowNumber_PRICE = 0;
  }


  loadInit(id){
    this.uploadComponent.resetEntity();
    if (id && id!=0)
    this.api.findContractById(id).subscribe(res => {
      console.log('findContractById', res);
      this.entity = res;
      this.uploadComponent.loadInit(res.ContractFile);
    })
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes', changes);
  //   this.resetEntity();
  //   if (changes.contractId.firstChange || changes.contractId.currentValue == null || changes.contractId.currentValue == 0) return;
  //   else {
  //     this.loadContractDetail(changes.contractId.currentValue);
  //   }
  // }
  private loadContractDetail(id) {
    this.uploadComponent.resetEntity();
    this.api.findContractById(id).subscribe(res => {
      console.log('findContractById', res);
      this.entity = res;
      
      this.uploadComponent.loadInit(res.ContractFile);
    })
  }
  ngAfterViewInit() {
    collapseIboxHelper();
  }
  /**Button Functions */
  async fnSave() {
    this.invalid = {};
    let e = this.entity;
    let valid = await this.api.validateContract(e).toPromise().then() as any
    if (valid.Success) {
      this.sendToApi(e);
    }
    else this.invalid[valid.Message] = true;
  }
  private async sendToApi(e) {
    e.SignDate = this.helper.dateConvertToString(e.SignDate);
    e.EffectiveDate = this.helper.dateConvertToString(e.EffectiveDate);
    e.EndDate = this.helper.dateConvertToString(e.EndDate);
    await this.uploadComponent.uploadFile();
    if (e.CustomerId == 0) { //New customer, just send to parrent
      let _sendParent = Object.assign({}, e); //stop binding
      this.send_entity.emit(_sendParent);
      $('#myContractModal').modal('hide');
    }
    else if (e.ContractId == 0) //add
    {
      console.log('create_contract', e);
      let operationResult = await this.api.addContract(e).toPromise().then().catch(err => this.toastr.error(err.statusText, 'Network')) as any;
      if (operationResult.Success) {
        this.toastr.success(this.trans.instant("messg.add.success"));
        this.entity.ContractId = operationResult.Data; //ID return;
        this.sendtoParentView(this.entity);
        ;
      }
      else this.toastr.warning(operationResult.Message);
    }
    else { //update
      console.log('update_Contract', e);
      let operationResult = await this.api.updateContract(e).toPromise().then().catch(err => this.toastr.error(err.statusText, 'Network')) as any;
      if (operationResult.Success) {
        this.toastr.success(this.trans.instant("messg.update.success"));
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
    $('#myContractModal').modal('hide');
  }
  async fnAddContractBreach(itemAdd) {
    if (!await this.validateBreach(itemAdd)) return;
    itemAdd.ContractID = this.entity.ContractId;
    this.entity.ContractBreach.push(itemAdd);
    this.newEntity_ContractBreach = new ContractBreach();
  }
  async fnAddContractPrice(itemAdd) {
    if (!await this.validatePrice(itemAdd)) return;
    itemAdd.ContractId = this.entity.ContractId;
    this.entity.ContractPrice.push(itemAdd);
    this.newEntity_ContractPrice = new ContractPrice();
  }
  fnEditContractBreach(index) {
    this.EditRowNumber = index + 1;
    this.subEntity_ContractBreach = this.entity.ContractBreach[index];
  }
  fnEditContractPrice(index) {
    this.EditRowNumber_PRICE = index + 1;
    this.subEntity_ContractPrice = this.entity.ContractPrice[index];
  }
  fnDeleteContractPrice(index) {
    this.entity.ContractPrice.splice(index, 1);
  }
  fnDeleteContractBreach(index) {
    this.entity.ContractBreach.splice(index, 1);
  }
  fnSaveContractBreach() {
    
  }
  async validatePrice(itemAdd) {
    let _validateRatio = await this.entity.ContractPrice.find(t =>t.Ratio  == itemAdd.Ratio )
    // && t.WarehouseLocationId!=itemAdd.WarehouseLocationId && itemAdd.WarehouseLocationId!=0
    if (_validateRatio && itemAdd != _validateRatio)
    {
      swal.fire("Validate", this.trans.instant('Contract.data.ContractPrice.Ratio') + this.trans.instant('messg.isexisted'), 'warning');
      return false;
    } 
    else {
      this.EditRowNumber_PRICE=0;
      return true;
    }
  }
  async validateBreach(itemAdd){
    let _validateBreachTimesType = await this.entity.ContractBreach.find(t =>t.BreachType  == itemAdd.BreachType &&  t.Times  == itemAdd.Times )
    // && t.WarehouseLocationId!=itemAdd.WarehouseLocationId && itemAdd.WarehouseLocationId!=0
    if (_validateBreachTimesType && itemAdd != _validateBreachTimesType)
    {
      swal.fire("Validate", this.trans.instant('Contract.data.ContractPrice.Ratio') + this.trans.instant('messg.isexisted'), 'warning');
      return false;
    } 
    else {
      this.EditRowNumber=0;
      return true;
    }

  }

  ratioOnChange(event){
    let _value = event.target.valueAsNumber;
    if (_value>100) this.entity.Ratio = 100
    else if (_value<1) this.entity.Ratio = 1
    else this.entity.Ratio = _value || 1;


  }

  breachTimesOnChange(event){
    let _value = event.target.valueAsNumber;
    if (_value<1) return 1
    else return _value || 1;
  }

  disabled_ContractPrice(){
    return !this.newEntity_ContractPrice.Currency || this.newEntity_ContractPrice.Ratio<=0 || this.newEntity_ContractPrice.Price<=0 || this.newEntity_ContractPrice.Tax<0;
  }

}
