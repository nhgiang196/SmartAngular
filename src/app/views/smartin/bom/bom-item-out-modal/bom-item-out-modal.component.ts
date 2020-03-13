import { Component, OnInit, Input } from '@angular/core';
import { Item, BomItemOut, Unit, BomFactory, Stage } from 'src/app/models/SmartInModels';
import { Subject } from 'rxjs';
declare let $: any;
import swal from "sweetalert2";
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-bom-item-out-modal',
  templateUrl: './bom-item-out-modal.component.html',
  styleUrls: ['./bom-item-out-modal.component.css']
})
export class BomItemOutModalComponent implements OnInit {
  @Input() entity: BomFactory;
  @Input() units: Unit[] =[];
  @Input() currentStageId: number
//const
  itemsBuffer : Item[]=[]
  items: Item[] =[]
  outBomItems: BomItemOut[] = [];
  bomItems: BomItemOut[];
  outBomItem: BomItemOut; 
   newBomItemOut: BomItemOut;
  //config
  input$ = new Subject<string>();
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  bufferSize = 50;
  editRowId: number = 0;
  parentOutId:number=0;
  laddaSubmitLoading = false;



  constructor( private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService) { }

  async ngOnInit() {
    this.onSearch(); // for search in server
    this.resetEntity();
    await this.loadItems();
  }

  private resetEntity() {
    this.outBomItem = new  BomItemOut(); 
    this.newBomItemOut = new BomItemOut();
    this.bomItems = [];
  }
  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.items.length <= this.itemsBuffer.length) 
        return;
    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length)
        this.fetchMore();
  }
    private fetchMore() {
      const len = this.itemsBuffer.length;
      const more = this.items.slice(len, this.bufferSize + len);
      this.loading = true;
      // using timeout here to simulate backend API delay
      setTimeout(() => {
        this.loading = false;      
        this.itemsBuffer = this.itemsBuffer.concat(more);
      }, 200)
    }

    
    async fnAddInBomItem() {
      // if(this.fnValidateBomItemOut(this.newBomItemOut,'add')){
      //   this.outBomItems.push(this.newBomItemOut);
      //   this.newBomItemOut = new BomItemOut();
      // }
      this.newBomItemOut.IsNew =true;
      this.entity.BomStage[this.currentStageId].BomItemOut.push(this.newBomItemOut);
      this.newBomItemOut = new BomItemOut();
    
    }
  
    fnValidateBomItemOut(item: BomItemOut,typeAction) {
      if (this.outBomItems.filter(x => x.ItemId == item.ItemId).length > 0 &&typeAction == "add") {
        swal.fire(
          "Validate",
          this.trans.instant("Factory.data.TechnologyName") +
            this.trans.instant("messg.isexisted"),
          "warning"
        );
        return false;
      }
      if (this.outBomItems.filter(x => x.ItemId == item.ItemId).length > 0 &&typeAction == "edit") {
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
    fnEditOutBomItem(index) {
      //press edit item (in modal)
      this.editRowId = index + 1;
      this.outBomItem =this.entity.BomStage[this.currentStageId].BomItemOut[index];
     // this.outBomItem = new BomItemOut();
    }
    
    fnSaveOutBomItem(index) {
      debugger;
      //if (this.fnValidateBomItemOut(this.outBfnSaveOutBomItemomItem,'edit')) {
        this.outBomItem.IsNew =true;
        this.entity.BomStage[this.currentStageId].BomItemOut[index] = this.outBomItem;
        this.editRowId = 0;
      //}
    }

    fnDeleteInBomItem(index) {
      //press delete item (in modal)
      this.entity.BomStage[this.currentStageId].BomItemOut.splice(index, 1);
    }

  async loadItems() {
    let keySearch = ""
    let data: any = await this.api.getItemPagination(keySearch).toPromise().then();
    this.items = data.result;
    console.log('records: ' +data.result.length);
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }
    onSearch(){
      this.input$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term =>  this.fakeService(term))
      ).subscribe(data => {
          this.itemsBuffer = data.slice(0, this.bufferSize);
        })
    }
    private  fakeService(term) {
      let data =  this.api.getItemPagination(term).pipe(map(data=> {
        return data.result.filter((x: { ItemName: string }) => x.ItemName.includes(term))
      }));   
      return data;
    }
    customSearchFn(term: string, item: Item) {
      term = term.toLowerCase();
      return item.ItemName.toLowerCase().indexOf(term) > -1
  }

  fnBackStageModal() {
    this.entity.BomStage[this.currentStageId].BomItemOut =this.entity.BomStage[this.currentStageId].BomItemOut.filter(x=>(x.IsNew ==false) )
    $("#modalOut").modal("hide");
    $("#modalStages").modal("show");
  }
  fnSaveBomItemOut() {
    // this.entity.BomStage[this.currentStageId].BomItemOut = this.outBomItems;
    // this.outBomItems = [];
    this.entity.BomStage[this.currentStageId].BomItemOut.forEach(item=>{
      item.Status=true;
      item.IsNew =false;
      return item;
    });



    console.log("BomItemOutType: " + this.currentStageId);
    console.log(this.entity);
  }

  showModalIn(i){
    this.parentOutId = i;
    $("#modalIn").modal("show");
    $("#modalOut").modal("hide");
  }

  
}
