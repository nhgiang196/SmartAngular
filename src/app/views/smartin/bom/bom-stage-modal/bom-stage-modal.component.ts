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
  existName: boolean = false;

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
    if (itemAdd.StageId == null) {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isnull"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.StageId == itemAdd.StageId).length) > 0 &&typeAction == "add") {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (( this.entity.BomStage.filter(t => t.StageId == itemAdd.StageId).length) > 1 &&typeAction == "edit") {
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
    this.editRowId = index + 1;
    this.bomStage = this.entity.BomStage[index];
  }

  fnDeleteStage(index) {
    this.entity.BomStage.splice(index, 1);
  }

  showBomModal(id) {
    this.currentStageId = id;
    $("#modalStages").modal("hide");
    $("#modalOut").modal("show");
  }
  onSwitchSequence() {
    !this.newBomStage.Sequence;
  }

  async fnAddStage() {
    let _checkValidate =  this.validateStage(this.newBomStage, "add");
    if (!_checkValidate) return;
    this.entity.BomStage.push(this.newBomStage);
    this.newBomStage = new BomStage();
  }

  async fnSave() {
    console.log(this.entity);
    this.api.addBomFactory(this.entity).subscribe(res=>{
        debugger
    });
  }
}
