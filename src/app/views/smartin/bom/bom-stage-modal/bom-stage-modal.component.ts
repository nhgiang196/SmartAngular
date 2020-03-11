import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Factory, BomFactory, Stage, BomStage, Unit } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import swal from "sweetalert2";
declare let $: any;
@Component({
  selector: 'app-bom-stage-modal',
  templateUrl: './bom-stage-modal.component.html',
  styleUrls: ['./bom-stage-modal.component.css']
})
export class BomStageModalComponent implements OnInit {
  @Input() entity: BomFactory;
  @Input() factories: Factory[];
  @Input() stages: Stage[] = [];
  @Input() units: Unit[] = []
  //varible
  laddaSubmitLoading = false;
  editRowId: number = 0;
  currentStageId: number = 0;

  bomStage: BomStage;
  newBomStage: BomStage;

  //config
  bsConfig = { dateInputFormat: "YYYY-MM-DD", adaptivePosition: true };
 
  constructor(private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService) { }

  ngOnInit() {
    console.log(this.factories);
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
    if (itemAdd.BomStageID == null) {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isnull"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.BomStageID == itemAdd.BomStageID).length) > 0 &&typeAction == "add") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.BomStageID == itemAdd.BomStageID).length) > 1 &&typeAction == "edit") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (typeAction == "edit") this.editRowId = 0;
    return true;
  }

  fnEditStage(index) {
    //press edit item (in modal)
    this.editRowId = index + 1;
    this.bomStage = this.entity.BomStage[index];
  }

  fnDeleteStage(index) {
    //press delete item (in modal)
    this.entity.BomStage.splice(index, 1);
  }

  showBomModal(id) {
    this.currentStageId = id;
    $("#myModal4").modal("hide");
    $("#myModal2").modal("show");
  }
  onSwitchSequence() {
    !this.newBomStage.Sequence;
  }

  async fnAddStage() {
    //press add item (in modal)
    let _checkValidate =  this.validateStage(this.newBomStage, "add");
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }

  async fnSave() {
    console.log(this.entity);
    // this.laddaSubmitLoading = true;
    // var e = this.entity;
    // if (await this.fnValidate()) {
    //   console.log("send entity: ", e);
    //   if (this.ACTION_STATUS == "add") {
    //     this.api.addBomFactory(e).subscribe(
    //       res => {
    //         var operationResult: any = res;
    //         if (operationResult.Success) {
    //           this.toastr.success(this.trans.instant("messg.add.success"));
    //           this.rerender();
    //         } else this.toastr.warning(operationResult.Message);
    //         this.laddaSubmitLoading = false;
    //         $("#myModal4").modal("hide");
    //       },
    //       err => {
    //         this.toastr.error(err.statusText);
    //         this.laddaSubmitLoading = false;
    //       }
    //     );
    //   }
    //   if (this.ACTION_STATUS == "update") {
    //     this.api.updateBomFactory(e).subscribe(
    //       res => {
    //         var operationResult: any = res;
    //         if (operationResult.Success) {
    //           this.toastr.success(this.trans.instant("messg.update.success"));
    //         } else this.toastr.warning(operationResult.Message);
    //         this.laddaSubmitLoading = false;
    //       },
    //       err => {
    //         this.toastr.error(err.statusText);
    //         this.laddaSubmitLoading = false;
    //       }
    //     );
    //   }
    //   //  await this.loadInit();
    // }
  }
}
