import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import {
  Item,
  BomItemOut,
  Unit,
  BomFactory,
  Stage
} from "src/app/models/SmartInModels";
import { Subject } from "rxjs";
declare let $: any;
import swal from "sweetalert2";
import { WaterTreatmentService } from "src/app/services/api-watertreatment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from "rxjs/operators";
import { SmartSelectComponent } from '../../ui-sample/smart-select/smart-select.component';
@Component({
  selector: "app-bom-item-out-modal",
  templateUrl: "./bom-item-out-modal.component.html",
  styleUrls: ["./bom-item-out-modal.component.css"]
})
export class BomItemOutModalComponent implements OnInit {
  @Input() entity: BomFactory;
  @Input() units: Unit[] = [];
  @Input() currentStageId: number;
  @Output() isLoadData = new EventEmitter<boolean>();
  //const
  itemsBuffer: Item[] = [];
  items: Item[] = [];
  outBomItems: BomItemOut[] = [];
  bomItems: BomItemOut[];
  outBomItem: BomItemOut;
  newBomItemOut: BomItemOut;
  //config
  editRowId: number = 0;
  parentOutId: number = 0;
  laddaSubmitLoading = false;

  constructor(
    private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService
  ) {}

  async ngOnInit() {
    this.resetEntity();
  }

  private resetEntity() {
    this.outBomItem = new BomItemOut();
    this.newBomItemOut = new BomItemOut();
    this.bomItems = [];
  }
  async fnAddInBomItem() {
    console.log(this.newBomItemOut);
    let _checkValidate =  this.fnValidateBomItemOut(this.newBomItemOut, "add");
    if (!_checkValidate) return;
    this.newBomItemOut.IsNew = true;
    this.entity.BomStage[this.currentStageId].BomItemOut.push(
      this.newBomItemOut
    );
    this.newBomItemOut = new BomItemOut();
    console.log(this.newBomItemOut);
  }

  fnValidateBomItemOut(item: BomItemOut, typeAction) {
    if (
      this.entity.BomStage[this.currentStageId].BomItemOut.filter(x => x.ItemId == item.ItemId).length > 0 &&
      typeAction == "add"
    ) {
      swal.fire(
        "Validate",
        this.trans.instant("Factory.data.TechnologyName") +
          this.trans.instant("messg.isexisted"),
        "warning"
      );
      return false;
    }
    if (
      this.entity.BomStage[this.currentStageId].BomItemOut.filter(x => x.ItemId == item.ItemId).length > 1 &&
      typeAction == "edit"
    ) {
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

  fnChangeItem(event:any){
    this.outBomItem = new BomItemOut();
    if(event != null)
    {
      this.outBomItem.ItemName = event.ItemName;
      this.outBomItem.ItemId = event.ItemId;
      this.api.getAllUnitByItemId(event.ItemId).subscribe(res=>{
        this.units = [];
        this.units = res.result;
      });
    }

  }

  fnChangeNewRecordItem(event:any){
    this.newBomItemOut = new BomItemOut();
    if(event != null)
    {
      this.newBomItemOut.ItemName = event.ItemName;
      this.newBomItemOut.ItemId = event.ItemId;
      this.api.getAllUnitByItemId(event.ItemId).subscribe(res=>{
        this.units = res.result;
      });
    }

  }

  fnEditOutBomItem(index) {
    //press edit item (in modal)
    this.editRowId = index + 1;
    this.outBomItem = this.entity.BomStage[this.currentStageId].BomItemOut[
      index
    ];
    // this.outBomItem = new BomItemOut();
  }

  fnSaveOutBomItem(index) {
    if (this.fnValidateBomItemOut(this.outBomItem,'edit')) {

      this.outBomItem.IsNew = true;
      this.entity.BomStage[this.currentStageId].BomItemOut[
        index
      ] = this.outBomItem;
      this.editRowId = 0;
    }
  }

  fnDeleteInBomItem(index) {
    //press delete item (in modal)
    this.entity.BomStage[this.currentStageId].BomItemOut.splice(index, 1);
  }
  fnBackStageModal() {
    this.entity.BomStage[this.currentStageId].BomItemOut = this.entity.BomStage[
      this.currentStageId
    ].BomItemOut.filter(x => x.IsNew == false);
    $("#modalOut").modal("hide");
    $("#modalStages").modal("show");
  }
  fnSaveBomItemOut() {
    this.entity.BomStage[this.currentStageId].BomItemOut.forEach(item => {
      item.Status = true;
      item.IsNew = false;
      return item;
    });

    console.log("BomItemOutType: " + this.currentStageId);
    console.log(this.entity);
  }

  showModalIn(i) {
    this.parentOutId = i;
    $("#modalIn").modal("show");
    $("#modalOut").modal("hide");
  }
}
