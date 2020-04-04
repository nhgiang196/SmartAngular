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
@Component({
  selector: 'app-bom-stage',
  templateUrl: './bom-stage.component.html',
  styleUrls: ['./bom-stage.component.css']
})
export class BomStageComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  @Output() loadInit= new EventEmitter<void>();
  entity: BomFactory;
  dataSourceStage:any;
  dataSourceUnitOut:any;
  dataSourceUnitIn:any;
  dataSourceItem:any;
   //config
   bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
  constructor(private devExtreme: DevextremeService,private bomService : BomService,private toastr: ToastrService,
    private trans: TranslateService, private auth: AuthService,
    private helpper: MyHelperService) {
    this.setItemValueOut = this.setItemValueOut.bind(this);
    this.setItemValueIn = this.setItemValueIn.bind(this);
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
    this.entity.BomFactoryValidateDate =  this.helpper.dateConvertToString(this.entity.BomFactoryValidateDate);

    if (!(await this.fnValidateBomServer())) {
      if (this.entity.BomFactoryId==0) {
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
          },
          err => {
            this.toastr.error(this.trans.instant("messg.add.error"));
          }
        );
      } else {
        this.entity.ModifyBy =this.auth.currentUser.Username;
        this.entity.ModifyDate = this.helpper.dateConvertToString(new Date());
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
          },
          err => {
            this.toastr.error(this.trans.instant("messg.update.error"));
          }
        );
      }
    } else {
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
    var data = (await this.bomService
      .validateBomFactory(this.entity)
      .toPromise()
      .then()) as any;
    console.log(data.result);
    return data.result;
  }
  removeEntityChild(){
    this.entity.BomStage.forEach(itemBomStage => {
      itemBomStage.Stage = null;
      itemBomStage.BomItemOut.forEach(itemBomOut => {
        itemBomOut.Item = null;
        itemBomOut.Unit = null;
        itemBomOut.BomItemIn.forEach(itemBomIn => {
          itemBomIn.Unit = null;
          itemBomIn.Item = null;
        });
      });
    });
  }


  loadDataSourceStage(){
    this.dataSourceStage = this.devExtreme.loadDxoLookup("Stage");
  }

  loadDataSourceItem(){
    this.dataSourceItem = this.devExtreme.loadDxoLookup("Item");
  }

   loaddataSourceUnitOut(){
     this.dataSourceUnitOut =  this.devExtreme.loadDxoLookup("Unit");
  }

  loaddataSourceUnitIn(){
    this.dataSourceUnitIn =  this.devExtreme.loadDxoLookup("Unit");
 }

  getBomOut(key: BomStage){
    if(key.BomItemOut==null){
      key.BomItemOut = new Array<BomItemOut>();
    }
     return key.BomItemOut;
  }

  getBomIn(key:BomItemOut){
    if(key.BomItemIn==null){
      key.BomItemIn = new Array<BomItemIn>();
    }
     return key.BomItemIn;
  }

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }
  showChildModal(item){
    if (item!=null){
      console.log(item);
    this.entity =JSON.parse(JSON.stringify(item));
    }
    else{
      this.entity = new BomFactory();
    }
    this.childModal.show();
  }

 async setItemValueOut(rowData: any, value: any) {
    rowData.UnitId = null;
    rowData.ItemId = value;
    this.dataSourceUnitOut = await this.bomService.getAllUnitByItemId(value).toPromise().then();
   //(<any>this).defaultSetCellValue(rowData, value);
 }

 async setItemValueIn(rowData: any, value: any) {
  rowData.UnitId = null;
  rowData.ItemId = value;
  this.dataSourceUnitIn = await this.bomService.getAllUnitByItemId(value).toPromise().then();
 //(<any>this).defaultSetCellValue(rowData, value);
}
}
