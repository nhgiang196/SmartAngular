import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { HttpEventType } from '@angular/common/http';
import { setQuarter } from 'ngx-bootstrap/chronos/units/quarter';
import { ContractComponent } from '../contract/contract.component';
import { async } from '@angular/core/testing';
import { CustomerService, AuthService, ContractService } from 'src/app/core/services';
import { SmartUploadComponent } from 'src/app/views/UISample/smart-upload/smart-upload.component';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { Customer } from 'src/app/core/models/customer';
import { Contract } from 'src/app/core/models/contrack';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
declare let $: any;
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  @ViewChild(ContractComponent, { static: true }) childView: ContractComponent;
  @ViewChild('customerFile', { static: true }) uploadComponent: SmartUploadComponent;
  constructor(
    private api: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private helper: MyHelperService,
    private trans: TranslateService,
    private auth: AuthService,
    private devService: DevextremeService,
    private contractService: ContractService,
  ) {
    this.factoryList = devService.loadDxoLookup("Factory");
  }
  factoryList: any;
  pathFile = "uploadFileCustomer";
  entity: Customer;
  invalid: any = { Existed_CustomerName: false, Null_CustomerName: false };
  initCombobox = { Factories: [], FullFactories: [] };
  EditRowNumber = 0;
  laddaSubmitLoading = false;
  app_contractId = 0;
  private editIndex: number = 0;
  ngOnInit() {
    this.resetEntity();
    this.childView.resetEntity();
    this.loadInit();
  }
  async loadInit() {
    /**Add Combobox Value: FACTORY */
    let dataResolver = this.route.snapshot.data["dataResolver"] as any;
    if (dataResolver) {
      this.entity = dataResolver;
      this.uploadComponent.loadInit(dataResolver.CustomerFile)
    }
    // await this.loadContractByCustomer();
    console.log(this.entity);
  }
  private async resetEntity() {
    this.entity = new Customer();
    this.invalid = {};
    this.EditRowNumber = 0;
    this.editIndex = 0;
  }
  async fnSave() {
    this.invalid = {};
    this.laddaSubmitLoading = true;
    // let _valid = await this.api.validateCustomer(this.entity).toPromise().then() as any;
    // if (!_valid.Success) {
    //   $('#tab1_Home').click();
    //   this.laddaSubmitLoading = false;
    //   this.invalid[_valid.Message] = true;
    //   return false;
    // }
    // else {
    var e = this.entity;
    await this.uploadComponent.uploadFile();
    e.Status = e.Status ? 1 : 0;
    if (this.route.snapshot.params.id == null) { //add
      e.CreateBy = this.auth.currentUser.Username;
      this.api.add(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.add.success"));
          this.router.navigate(["pages/category/customer/" + operationResult.Data]);
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
    else {
      e.ModifyBy = this.auth.currentUser.Username;
      this.api.update(e).then(res => {
        var operationResult: any = res
        if (operationResult.Success) {
          this.toastr.success(this.trans.instant("messg.update.success"));
          this.router.navigate(["pages/category/customer/" + this.entity.CustomerId]);
        }
        else this.toastr.warning(operationResult.Message);
        this.laddaSubmitLoading = false;
      }, err => { this.toastr.error(err.statusText); this.laddaSubmitLoading = false; })
    }
    return true;
    // }
  }
  fnEditItem(contractId, index) {
    if (this.entity.CustomerId != 0) this.childView.resetEntity();
    console.log('edit item', contractId);
    console.log('edit index', index)
    this.editIndex = index;
    this.app_contractId = contractId;
    this.childView.resetEntity();
    this.childView.loadInit(contractId)
  }
  fnDeleteItem(index) {
    swal.fire({
      title: this.trans.instant('Contract.mssg.DeleteAsk_Title'),
      titleText: this.trans.instant('Contract.mssg.DeleteAsk_Text'),
      confirmButtonText: this.trans.instant('Button.OK'),
      cancelButtonText: this.trans.instant('Button.Cancel'),
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.contractService.remove(this.entity.Contract[index].ContractId).then((data)=>{
          let res = data as any;
          if (res.Success) {
            this.entity.Contract.splice(index, 1);
            this.toastr.success(this.trans.instant('messg.delete.success'))
          }
          else this.toastr.warning(res.Message)
        }).catch((err)=>{ this.toastr.error(err.statusText);})
        
      }
    })
  }
  async onChangeAdd(returnContract: Contract) {
    console.log('return Contract', returnContract);
    if (returnContract.CustomerId == 0)
      swal.fire({
        titleText: this.trans.instant('Customer.mssg.AskForCreateContractCustomer'),
        confirmButtonText: this.trans.instant('Button.OK'),
        cancelButtonText: this.trans.instant('Button.Cancel'),
        type: 'question',
        showCancelButton: true,
        reverseButtons: true
      }).then(async (result) => {
        if (result.value) {
          this.entity.Contract.splice(this.editIndex, 1, returnContract);
          let saveValidate = await this.fnSave();
          if (!saveValidate) this.entity.Contract = [];
        }
      })
    else {
      this.entity.Contract.splice(this.editIndex, 1, returnContract);
    }
  }
  validateFunction_FactoryId = (e) => {
    return !(e.value == 0 || e.value == null)
  };
  validateAsync_CustomerCode = (e) => {
    return new Promise(async (resolve) => {
      let obj = new Customer(); //stop binding
      obj['CustomerCode'] = e.value;
      obj.CustomerId = this.entity.CustomerId;
      let _res = await this.api.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf('CustomerCode') < 0;
      resolve(_validate);
    });
  }
  validateAsync_CustomerName = (e) => {
    return new Promise(async (resolve) => {
      let obj = new Customer(); //stop binding
      obj['CustomerName'] = e.value;
      obj.CustomerId = this.entity.CustomerId;
      let _res = await this.api.validate(obj).then() as any;
      let _validate = _res.Success ? _res.Success : _res.ValidateData.indexOf('CustomerName') < 0;
      resolve(_validate);
    });
  }
  ngAfterViewInit() {
  }
}
