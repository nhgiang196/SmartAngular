import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BomStage, BomFactory, BomItemOut, BomItemIn } from 'src/app/core/models/bom';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { BomService, AuthService } from 'src/app/core/services';
import { async } from 'rxjs/internal/scheduler/async';
import { MyHelperService } from 'src/app/core/services/utility/my-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import swal from "sweetalert2";
import { checkActiveTab } from 'src/app/app.helpers';
import { NotifyService } from 'src/app/core/services/utility/notify.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { DxFormComponent } from 'devextreme-angular';
@Component({
  selector: 'app-bom-stage',
  templateUrl: './bom-stage.component.html',
  styleUrls: ['./bom-stage.component.css']
})
export class BomStageComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @ViewChild('targetForm', { static: true }) targetForm: DxFormComponent;
  @Output() loadInit = new EventEmitter<void>();
  entity: BomFactory;
  dataSourceStage: any;
  dataSourceUnitOut: any;
  dataSourceUnitIn: any;
  dataSourceItem: any;
  itemOutValidate:any;
  itemInValidate:any;
  dataSourceFactory:any;
  lookupField : any = {};
  disabledSave:any;
  buttonOptions2 = {
    stylingMode: 'text', // để tắt đường viền container
    template: ` <button type="button" class="btn btn-white" data-dismiss="modal"> ${this.trans.instant('Button.Close')}</button>`, //template hoạt động cho Ispinia,
  }

  buttonOptions = {
    stylingMode: 'text', // để tắt đường viền container
    template: `<button type="button" class="btn btn-primary"><i class="fa fa-plus"></i> ${this.trans.instant('Button.Save')}</button>`, //template hoạt động cho Ispinia
    useSubmitBehavior: true, //submit = validate + save
  }
  //config
  laddaSubmitLoading = false;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  constructor(private devExtreme: DevextremeService, private bomService: BomService, private toastr: ToastrService,
    public trans: TranslateService, private auth: AuthService, private notifyService:NotifyService,
    private helpper: MyHelperService, lang: LanguageService) {
    this.getFilteredUnit = this.getFilteredUnit.bind(this);
    this.validationStageCallback =this.validationStageCallback.bind(this);
    this.validationOrderCallback= this.validationOrderCallback.bind(this);
    this.fnDeleteStage = this.fnDeleteStage.bind(this);
    this.validationItemOutCallback =this.validationItemOutCallback.bind(this);
    this.validationItemInCallback =this.validationItemInCallback.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.lookupField['Status'] = devExtreme.loadDefineSelectBox('Status',lang.getLanguage());
  }

  ngOnInit() {
    this.lookupField['Status'].load()
    this.entity = new BomFactory();
    this.loadDataSourceStage();
    this.loadDataSourceItem();

    this.loaddataSourceUnitOut();
    this.dataSourceFactory = this.devExtreme.loadDxoLookup("Factory");
  }
  async fnSave() {
    if(!this.targetForm.instance.validate().isValid){
      return;
    }

    //Custom remove entity child
    this.removeDevID();
    console.log(this.entity);
    this.entity.BomFactoryValidateDate = this.helpper.dateConvertToString(this.entity.BomFactoryValidateDate);
    this.laddaSubmitLoading = true;
    if (!(await this.fnValidateBomServer())) {
      if (this.entity.BomFactoryId == 0) {
        this.entity.CreateBy = this.auth.currentUser.Username;
        this.entity.CreateDate = this.helpper.dateConvertToString(new Date());
        this.bomService.add(this.entity).then(
          res => {
            let result = res as any;
            if (result.Success) {
              this.toastr.success(this.trans.instant("messg.update.success"));
              this.loadInit.emit();
              this.childModal.hide();
            } else {
              this.toastr.error(this.trans.instant("messg.update.error"));
            }

            this.laddaSubmitLoading = false;
          },
          err => {
            this.toastr.error(this.trans.instant("messg.add.error"));
            this.laddaSubmitLoading = false;
          }
        );
      } else {
        this.entity.ModifyBy = this.auth.currentUser.Username;
        this.entity.ModifyDate = this.helpper.dateConvertToString(new Date());
        this.removeIdChild();

        this.bomService.update(this.entity).then(
          res => {
            var result = res as any;
            if (result.Success) {
              this.toastr.success(this.trans.instant("messg.update.success"));
              this.loadInit.emit();
              this.childModal.hide();
            } else {
              this.toastr.error(this.trans.instant("messg.update.error"));
            }
            this.laddaSubmitLoading = false;
          },
          err => {
            this.toastr.error(this.trans.instant("messg.update.error"));
            this.laddaSubmitLoading = false;
          }
        );
      }
    } else {
      this.laddaSubmitLoading = false;
      swal.fire(
        {
          title: this.trans.instant('messg.validation.caption'),
          titleText: this.trans.instant('BomFactory.mssg.ErrorExistFactoryAndValidate'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'error',
        }
      );
      return;
    }
  }

  removeDevID(){
    if( this.entity.BomStage!=null && this.entity.BomStage.length >0){
      this.entity.BomStage.forEach(x=>{
        if(typeof x.BomStageId=="string")
          x.BomStageId =0;
        if(x.BomItemOut!=null && x.BomItemOut.length>0){
          x.BomItemOut.forEach(i=>{
            if(typeof i.BomItemOutId=="string")
              i.BomItemOutId =0;
              if(i.BomItemIn!=null && i.BomItemIn.length>0){
                i.BomItemIn.forEach(z=>{
                  if(typeof z.BomItemInId=="string")
                      z.BomItemInId =0;
                  return z;
                })
              }
            return i;
          })
        }

        return x;
      })
    }

  }

  async fnValidateBomServer() {

    let model: BomFactory = JSON.parse(JSON.stringify(this.entity));
    model.BomStage = null;
    var data = (await this.bomService
      .validate(model)
      .then()) as any;
    return data;
  }
  removeIdChild() {
    if (this.entity.BomStage.length > 0)
      this.entity.BomStage.forEach(itemBomStage => {
        itemBomStage.BomStageId = 0;
        itemBomStage.BomFactoryId = 0;
        if (itemBomStage.BomItemOut != null && itemBomStage.BomItemOut.length > 0)
          itemBomStage.BomItemOut.forEach(itemBomOut => {
            itemBomOut.BomItemOutId = 0;
            itemBomOut.BomStageId = 0;
            if (itemBomOut.BomItemIn != null && itemBomOut.BomItemIn.length > 0)
              itemBomOut.BomItemIn.forEach(itemBomIn => {
                itemBomIn.BomItemInId = 0;
                itemBomIn.BomStageId = 0;
              });
          });
      });
  }

  validationStageCallback(e){
    if(this.entity.BomStage.find(x=>x.StageId==e.value && x.BomStageId !=e.data.BomStageId)){
      return false;
    }
    return true
  }

  validationOrderCallback(e){
    if(e.value<=0)
    {
      e.rule.message=">0"
      return false;
    }


    if(this.entity.BomStage.find(x=>x.OrderNumber ==e.value&& x.BomStageId !=e.data.BomStageId)){
      e.rule.message ="Thứ tự không được trùng"
      return false;
    }
    return true;
  }


  loadDataSourceStage() {
    this.dataSourceStage = this.devExtreme.loadDxoLookup("Stage");
  }

  loadDataSourceItem() {
    let filter =[["ItemTypeId","=",3],"and",["Status","=",1]];
    this.dataSourceItem = this.devExtreme.loadDxoLookupFilter("Item",filter);
  }

  loaddataSourceUnitOut() {
    this.dataSourceUnitOut = this.devExtreme.loadDxoLookup("Unit");
  }

  loaddataSourceUnitIn() {
    this.dataSourceUnitIn = this.devExtreme.loadDxoLookup("Unit");
  }

  getBomOut(key: BomStage) {
    if (key.BomItemOut == null) {
      key.BomItemOut = new Array<BomItemOut>();
    }
    this.itemOutValidate = key.BomItemOut;
    return key.BomItemOut;
  }

  getBomIn(key: BomItemOut) {
    if (key.BomItemIn == null) {
      key.BomItemIn = new Array<BomItemIn>();
    }
    this.itemInValidate = key.BomItemIn;
    return key.BomItemIn;
  }

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
  showChildModal(item) {
    if (item != null) {
      this.entity = JSON.parse(JSON.stringify(item));
    }
    else {
      this.entity = new BomFactory();
      this.targetForm.instance.resetValues();
    }
    this.childModal.show();
  }

  setItemValueOut(rowData: any, value: any) {
    rowData.UnitId = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  getFilteredUnit(options) {
    if (options == null || options.data == null)
      {
        return {
          store: createStore({
            key: "UnitId",
            loadUrl: `${environment.apiUrl}/Unit/UI_SelectBox`,
            loadParams: { KeyId: "UnitId" }
          }),
          paginate: true,
          pageSize: 10
        }
      }
    else {
      return {
        store: createStore({
          key: "UnitId",
          loadUrl: `${environment.apiUrl}/Unit/GetAllUnitBomByItemIdLookup`,
          loadParams: { KeyId: "UnitId",valueId:options.data.ItemId }
        }),
        paginate: true,
        pageSize: 10
      }

    }
  }

  async setItemValueIn(rowData: any, value: any) {
    rowData.UnitId = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  validationItemOutCallback(e){
    if(this.itemOutValidate.find(x=>x.ItemId==e.value && x.BomItemOutId !=e.data.BomItemOutId)){
      e.rule.message ="Vật tư không được trùng"
      return false;
    }
    return true
  }

  validationItemInCallback(e){
    if(this.itemInValidate.find(x=>x.ItemId==e.value && x.BomItemInId !=e.data.BomItemInId)){
      e.rule.message ="Vật tư không được trùng"
      return false;
    }
    return true
  }

  onRowValidatingBomIn(e, item: BomItemOut) {
    if (e.oldData == null) {
      //thêm mới
      if (item.BomItemIn.find(x => x.ItemId == e.newData.ItemId)) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (item.BomItemIn.find(x => x.ItemId == e.newData.ItemId) && e.newData.ItemId != e.oldData.ItemId) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
  }

  closeModal(){
    this.childModal.hide()
  }

  enableActiveTab() {
   this.disabledSave=  checkActiveTab();
  }

  fnDeleteStage(e){
    console.log(e);
    this.notifyService.confirmDelete(() => {
      this.entity.BomStage= this.entity.BomStage.filter(item => item.BomStageId !==  e.row.data.BomStageId);
    });
  }

}
