import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BomStage, BomFactory, BomItemOut, BomItemIn } from 'src/app/core/models/bom';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import { BomService, AuthService } from 'src/app/core/services';
import { async } from 'rxjs/internal/scheduler/async';
import { MyHelperService } from 'src/app/core/services/my-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import swal from "sweetalert2";
import { checkActiveTab } from 'src/app/app.helpers';
@Component({
  selector: 'app-bom-stage',
  templateUrl: './bom-stage.component.html',
  styleUrls: ['./bom-stage.component.css']
})
export class BomStageComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @Output() loadInit = new EventEmitter<void>();
  entity: BomFactory;
  dataSourceStage: any;
  dataSourceUnitOut: any;
  dataSourceUnitIn: any;
  dataSourceItem: any;
  //config
  laddaSubmitLoading = false;
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  constructor(private devExtreme: DevextremeService, private bomService: BomService, private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService,
    private helpper: MyHelperService) {
    //this.setItemValueOut = this.setItemValueOut.bind(this);
    this.getFilteredUnit = this.getFilteredUnit.bind(this);
    //this.setItemValueIn = this.setItemValueIn.bind(this);
    this.setCellUnitValue = this.setCellUnitValue.bind(this);
  }

  ngOnInit() {
    this.entity = new BomFactory();
    this.loadDataSourceStage();
    this.loadDataSourceItem();

    this.loaddataSourceUnitOut();
    this.loaddataSourceUnitIn();
  }
  async fnSave() {
    //Custom remove entity child
    //this.removeEntityChild();
    this.entity.BomFactoryValidateDate = this.helpper.dateConvertToString(this.entity.BomFactoryValidateDate);
    this.laddaSubmitLoading = true;
    if (!(await this.fnValidateBomServer())) {
      if (this.entity.BomFactoryId == 0) {
        this.entity.CreateBy = this.auth.currentUser.Username;
        this.entity.CreateDate = this.helpper.dateConvertToString(new Date());
        this.bomService.addBomFactory(this.entity).subscribe(
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
        console.log("a", this.entity);

        this.bomService.updateBomFactory(this.entity).subscribe(
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
  async fnValidateBomServer() {
    console.log(this.entity);
    let model: BomFactory = JSON.parse(JSON.stringify(this.entity));
    model.BomStage = null;
    var data = (await this.bomService
      .validateBomFactory(model)
      .toPromise()
      .then()) as any;
    console.log(data);
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


  loadDataSourceStage() {
    this.dataSourceStage = this.devExtreme.loadDxoLookup("Stage");
  }

  loadDataSourceItem() {
    this.dataSourceItem = this.devExtreme.loadDxoLookup("Item");
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
    return key.BomItemOut;
  }

  getBomIn(key: BomItemOut) {
    if (key.BomItemIn == null) {
      key.BomItemIn = new Array<BomItemIn>();
    }
    return key.BomItemIn;
  }

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
  showChildModal(item) {
    if (item != null) {
      console.log(item);
      this.entity = JSON.parse(JSON.stringify(item));
    }
    else {
      this.entity = new BomFactory();
    }
    this.childModal.show();
  }

  setItemValueOut(rowData: any, value: any) {
    rowData.UnitId = null;
    // rowData.ItemId = value;
    //this.dataSourceUnitOut = await this.bomService.getAllUnitByItemId(value).toPromise().then();
    (<any>this).defaultSetCellValue(rowData, value);
  }

  getFilteredUnit(options) {
    console.log("=========>")
    console.log(options)
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
          loadUrl: `${environment.apiUrl}/BomFactory/GetAllUnitBomByItemIdLookup`,
          loadParams: { KeyId: "UnitId",valueId:options.data.ItemId }
        }),
        paginate: true,
        pageSize: 10
      }

    }
  }

  async setItemValueIn(rowData: any, value: any) {
    rowData.UnitId = null;
    // rowData.ItemId = value;
    //this.dataSourceUnitIn = await this.bomService.getAllUnitByItemId(value).toPromise().then();
    (<any>this).defaultSetCellValue(rowData, value);
  }

  onRowValidatingBomStage(e) {
    if (e.oldData == null) {
      //thêm mới
      if (this.entity.BomStage.find(x => x.StageId == e.newData.StageId)) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (this.entity.BomStage.find(x => x.StageId == e.newData.StageId) && e.newData.StageId != e.oldData.StageId) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
  }

  onRowValidatingBomOut(e, item: BomStage) {
    if (e.oldData == null) {
      //thêm mới
      if (item.BomItemOut.find(x => x.ItemId == e.newData.ItemId)) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
    else {
      //chỉnh sửa
      if (item.BomItemOut.find(x => x.ItemId == e.newData.ItemId) && e.newData.ItemId != e.oldData.ItemId) {
        swal.fire("Validate", "Dữ liệu đã bị trùng", "warning");
        e.isValid = false;
      }
    }
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

  setCellUnitValue(rowData: any, value: any) {
    rowData.UnitId = value;
    this.dataSourceUnitIn = this.devExtreme.loadDxoLookup("Unit");
  }

  enableActiveTab() {
    checkActiveTab();
  }
}
