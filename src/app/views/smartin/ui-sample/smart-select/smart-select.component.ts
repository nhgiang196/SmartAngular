import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item, BomItemIn, Unit, BomFactory, Stage } from 'src/app/models/SmartInModels';
import { Subject } from 'rxjs';
declare let $: any;
import swal from "sweetalert2";
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-smart-select',
  templateUrl: './smart-select.component.html',
  styleUrls: ['./smart-select.component.css']
})
export class SmartSelectComponent implements OnInit {

  constructor(private api: WaterTreatmentService,
    private toastr: ToastrService,
    private trans: TranslateService) { }

  
  typeBomIn: string = "In";
  typeBomOut: string = "Out";
  itemsBuffer : Item[]=[]
  items: Item[] =[]
  //config
  input$ = new Subject<string>();
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  bufferSize = 50;
  editRowId: number = 0;
  laddaSubmitLoading = false;

  inBomItems: BomItemIn[] = [];
  bomItems: BomItemIn[];
  inBomItem: BomItemIn;
   newBomItem: BomItemIn;


  

  async ngOnInit() {
    this.onSearch();
    this.inBomItem = new BomItemIn(); 
    this.newBomItem = new BomItemIn();
    this.bomItems = [];
    await this.loadItems();
  }

  async loadItems() {
    let keySearch = ""
    let data: any = await this.api.getItemPagination(keySearch).toPromise().then();
    this.items = data.result;
    console.log('records: ' +data.result.length);
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }
  

  onSearch(){ //ng-select
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(), 
      switchMap(term =>  this.fakeService(term))
    ).subscribe(data => {
        this.itemsBuffer = data.slice(0, this.bufferSize);
      })
  }
  private  fakeService(term) { //ng-select
      let data =  this.api.getItemPagination(term).pipe(map(data=> {
        return data.result.filter((x: { ItemName: string }) => x.ItemName.includes(term))
      }));   
      return data;
    }
  customSearchFn(term: string, item: Item) { //ng-select
      term = term.toLowerCase();
      return item.ItemName.toLowerCase().indexOf(term) > -1
  }

  onScrollToEnd() { //ng-select
    this.fetchMore();
  }

  onScroll({ end }) { //ng-select
    if (this.loading || this.items.length <= this.itemsBuffer.length) 
        return;
    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length)
        this.fetchMore();
  }
    private fetchMore() { //ng-select
      const len = this.itemsBuffer.length;
      const more = this.items.slice(len, this.bufferSize + len);
      this.loading = true;
      // using timeout here to simulate backend API delay
      setTimeout(() => {
        this.loading = false;      
        this.itemsBuffer = this.itemsBuffer.concat(more);
      }, 200)
    }


    
  

}
