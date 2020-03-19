import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {
  Factory,
  BomFactory,
  Stage,
  BomStage,
  Unit
} from "src/app/models/SmartInModels";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { async } from "@angular/core/testing";
import { MyHelperService } from 'src/app/services/my-helper.service';
declare let $: any;
@Component({
  selector: "app-bom-stage-modal",
  templateUrl: "./bom-stage-modal.component.html",
  styleUrls: ["./bom-stage-modal.component.css"]
})
export class BomStageModalComponent implements OnInit {
  @Input() entity: BomFactory;
  @Input() action: string;
  @Input() initComboboxFactories: any;
  @Input() initComboboxStages: any;
  @Input() units: Unit[] = [];
  @Output() isLoadData = new EventEmitter<boolean>();
  //varible
  laddaSubmitLoading = false;
  editRowId: number = 0;
  currentStageId: number = 0;

  bomStage: BomStage;
  newBomStage: BomStage;
  existName: boolean = false;

  //config
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService,
    private auth: AuthService,
    private helpper: MyHelperService,
  ) {}

  ngOnInit() {
    this.resetEntity();
  }

  private resetEntity() {
    this.entity = new BomFactory();
    this.bomStage = new BomStage();
    this.newBomStage = new BomStage();
  }

  onSwitchStatus() {
    this.entity.Status = this.entity.Status == 0 ? 1 : 0;
  }

  validateStage(itemAdd: BomStage, typeAction) {
    if (itemAdd.StageId == null) {
      swal.fire(
        {
          title: this.trans.instant('messg.validation.caption'),
          titleText: this.trans.instant('BomFactory.mssg.ErrorExistStage'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'error',
        }
      );
      return false;
    }
    if (
      this.entity.BomStage.filter(t => t.StageId == itemAdd.StageId).length >
        0 &&
      typeAction == "add"
    ) {
      swal.fire(
        {
          title: this.trans.instant('messg.validation.caption'),
          titleText: this.trans.instant('BomFactory.mssg.ErrorExistStage'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'error',
        }
      );
      return false;
    }
    if (
      this.entity.BomStage.filter(t => t.StageId == itemAdd.StageId).length >
        1 &&
      typeAction == "edit"
    ) {
      swal.fire(
        {
          title: this.trans.instant('messg.validation.caption'),
          titleText: this.trans.instant('BomFactory.mssg.ErrorExistStage'),
          confirmButtonText: this.trans.instant('Button.OK'),
          type: 'error',
        }
      );
      return false;
    }
    if (typeAction == "edit") this.editRowId = 0;
    return true;
  }

  fnEditStage(index) {
    if (
      this.initComboboxStages.Stages.find(
        x =>
          x.StageId == this.entity.BomStage[this.currentStageId].StageId &&
          x.isCopy != true
      ) == null
    ) {
      let item = this.initComboboxStages.FullStages.find(
        x => x.StageId == this.entity.BomStage[this.currentStageId].StageId
      );
      this.initComboboxStages.Stages = this.initComboboxStages.StagesCopy.concat(
        [{ StageId: item.StageId, StageName: item.StageName, isCopy: true }]
      );
    } else {
      this.initComboboxStages.Stages = this.initComboboxStages.StagesCopy;
    }

    this.editRowId = index + 1;
    this.bomStage = this.entity.BomStage[index];
  }

  fnDeleteStage(index) {
    this.entity.BomStage.splice(index, 1);
  }

  showBomModal(id) {
    console.log("entity", this.entity);
    this.currentStageId = id;
    $("#modalStages").modal("hide");
    $("#modalOut").modal("show");
  }
  onSwitchSequence() {
    !this.newBomStage.Sequence;
  }

  async fnAddStage() {
    let _checkValidate = this.validateStage(this.newBomStage, "add");
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }

  async fnSave() {
    //Custom remove entity child
    this.removeEntityChild();
    this.entity.Validate =  this.helpper.dateConvertToString(this.entity.Validate);

    if (!(await this.fnValidateBomServer())) {
      if (this.action == "add") {
        this.entity.CreateBy = this.auth.currentUser.Username;
        this.entity.CreateDate = this.helpper.dateConvertToString(new Date());
        this.api.addBomFactory(this.entity).subscribe(
          res => {
            this.toastr.success(this.trans.instant("messg.add.success"));
            this.isLoadData.emit(true);
            $("#modalStages").modal("hide");
          },
          err => {
            this.isLoadData.emit(true);
            this.toastr.error(this.trans.instant("messg.add.error"));
          }
        );
      } else {
        this.entity.ModifyBy =this.auth.currentUser.Username;
        this.entity.ModifyDate = this.helpper.dateConvertToString(new Date());
        console.log("a", this.entity);
        this.api.updateBomFactory(this.entity).subscribe(
          res => {
            var result = res as any;
            if (result.Success) {
              this.toastr.success(this.trans.instant("messg.update.success"));
              $("#modalStages").modal("hide");
              this.isLoadData.emit(true);
            } else {
              this.toastr.error(this.trans.instant("messg.update.error"));
            }
          },
          err => {
            this.isLoadData.emit(true);
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
    var data = (await this.api
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
}
