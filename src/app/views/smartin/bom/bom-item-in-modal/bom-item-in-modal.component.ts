import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  Item,
  BomItemIn,
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
@Component({
  selector: "app-bom-item-in-modal",
  templateUrl: "./bom-item-in-modal.component.html",
  styleUrls: ["./bom-item-in-modal.component.css"]
})
export class BomItemInModalComponent implements OnInit {
  @Input() entity: BomFactory;
  @Input() units: Unit[] = [];
  @Input() parentOutId: number;
  @Input() currentStageId: number;
  @Output() isLoadData = new EventEmitter<boolean>();
  //const

  itemsBuffer: Item[] = [];
  items: Item[] = [];
  inBomItems: BomItemIn[] = [];
  bomItems: BomItemIn[];
  inBomItem: BomItemIn;
  newBomItem: BomItemIn;
  //config
  editRowId: number = 0;
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
    this.inBomItem = new BomItemIn();
    this.newBomItem = new BomItemIn();
    this.bomItems = [];
  }

  fnSaveInBomItem(index) {
    console.log(this.inBomItems);

    if (this.fnValidateBomItem(this.inBomItem, "edit")) {
      this.inBomItem.IsNew = true;
      this.entity.BomStage[this.currentStageId].BomItemOut[index].BomItemIn[
        this.parentOutId
      ] = this.inBomItem;
      this.editRowId = 0;
    }
  }
  async fnAddInBomItem() {
    let _checkValidate = this.fnValidateBomItem(this.newBomItem, "add");
    if (!_checkValidate) return;
    this.newBomItem.IsNew = true;
    this.entity.BomStage[this.currentStageId].BomItemOut[
      this.parentOutId
    ].BomItemIn.push(this.newBomItem);
    this.newBomItem = new BomItemIn();
    //}
  }

  fnChangeItem(event:any){
    this.inBomItem = new BomItemIn();
    if(event != null)
    {
      this.inBomItem.ItemName = event.ItemName;
      this.inBomItem.ItemId = event.ItemId;
      this.api.getAllUnitByItemId(event.ItemId).subscribe(res=>{
        this.units = res.result;
      });
    }
    
  }

  fnChangeNewRecordItem(event:any){
    this.newBomItem = new BomItemIn();
    if(event != null)
    {
      this.newBomItem.ItemName = event.ItemName;
      this.newBomItem.ItemId = event.ItemId;
      this.api.getAllUnitByItemId(event.ItemId).subscribe(res=>{
        this.units = res.result;
      });
    }
    
  }

  fnValidateBomItem(item: BomItemIn, typeAction) {
    if (
      this.entity.BomStage[this.currentStageId].BomItemOut[
        this.parentOutId
      ].BomItemIn.filter(x => x.ItemId == item.ItemId).length > 0 &&
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
      this.entity.BomStage[this.currentStageId].BomItemOut[
        this.parentOutId
      ].BomItemIn.filter(x => x.ItemId == item.ItemId).length > 1 &&
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

  fnEditInBomItem(index) {
    //press edit item (in modal)
    this.editRowId = index + 1;
    this.inBomItem = this.entity.BomStage[this.currentStageId].BomItemOut[
      this.parentOutId
    ].BomItemIn[index];
    this.newBomItem = new BomItemIn();
  }

  fnDeleteInBomItem(index) {
    //press delete item (in modal)
    this.entity.BomStage[this.currentStageId].BomItemOut[this.parentOutId].BomItemIn.splice(index, 1);
  }

  fnReset() {
    this.inBomItems = [];
    this.inBomItem = new BomItemIn();
  }

  fnBackModalOut() {
    this.entity.BomStage[this.currentStageId].BomItemOut[
      this.parentOutId
    ].BomItemIn = this.entity.BomStage[this.currentStageId].BomItemOut[
      this.parentOutId
    ].BomItemIn.filter(x => x.IsNew == false);

    console.log(this.entity);
    $("#modalIn").modal("hide");
    $("#modalOut").modal("show");
  }

  fnSaveBomItem() {
    this.entity.BomStage[this.currentStageId].BomItemOut[
      this.parentOutId
    ].BomItemIn.forEach(item => {
      item.Status = true;
      item.IsNew = false;
      return item;
    });
    $("#modalIn").modal("hide");
    $("#modalOut").modal("show");
  }
}
