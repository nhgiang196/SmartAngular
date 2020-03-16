import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { SmartItem, DataTablePaginationParams  } from 'src/app/models/SmartInModels';
import { Subject } from 'rxjs';
declare let $: any;
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-smart-select',
  templateUrl: './smart-select.component.html',
  styleUrls: ['./smart-select.component.css']
})


export class SmartSelectComponent implements OnInit {
  /** Tên danh sách hoặc thực thể 
   * @example : 'Item'
  */
  @Input('listName') entityString : string = 'Items';
   /** Giá trị placeholder được translate
     * @example : 'BomFactory.BomItem.id'
     */
  @Input('translatePlaceholder')  translatePlaceholder : string = '';
  /** Kết quả trả về
   * @example: itemID = $event
   */
  @Output('select_ngModel') send_value : EventEmitter<string>;

  constructor(private api: WaterTreatmentService) { }

  /**Dấu hiệu load */
  loading = false;
  /**Check giá trị nhập */
  input$ = new Subject<string>();
  /** Số item còn sót lại để thực hiện tác vụ load tiếp tục */
  numberOfItemsFromEndBeforeFetchingMore = 10;
  /** Số dòng */
  bufferSize = 50; 
  /** Danh sánh sau khi lọc*/
  itemsBuffer : SmartItem[]=[];
  /**Danh sách đầy đủ */
  items:SmartItem[] = []; 
  /**Giá trị chọn */
  chooseItem : SmartItem
  /**  */
  private sendParams : DataTablePaginationParams = new DataTablePaginationParams();

  async ngOnInit() { 
    this.chooseItem = new SmartItem();

    await this.loadInit(); //init load 
    this.onSearch(); //input Event

  }


  private selectParams(keyword: string = null){
    var pr = new DataTablePaginationParams();
    pr.page = 0;
    pr.pageSize = this.bufferSize;
    switch (this.entityString) {
      case 'Items':
        pr.selectFields = "[id] = ItemId, [text] =  ItemNo  ";
        pr.entity = 'Item';
        pr.orderBy='ItemNo';
        // pr.specialCondition = keyword? `  ItemNo  +' '+ ItemName LIKE N'%${keyword}%'` : null
        break;
      case 'Users':

        break;
      default:  
        break;
    }
    return pr;
  }

  async loadInit() {
    var pr = this.selectParams();
    let res =  await this.api.getItemPagination_Smart(pr).toPromise().then() as any; 
    this.items = res.result;
    console.log('mapdata', this.items);
    console.log('records: ' +res.totalCount);
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }
  
  onSearch(){ 
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(), 
      switchMap(term =>  this.fakeService(term))
    ).subscribe(data => {
        // console.log('buffer reflect:', data.slice(0, this.bufferSize))
        // this.itemsBuffer = data.slice(0, this.bufferSize); //INIT FIRST TIME AFTER CHANGE INPUT
        this.itemsBuffer = [];
        this.itemsBuffer = data;
        this.loading = false;
      })
  }

  private async  fakeService(term) { 
    
    this.loading = true;
    console.log('Input term: ', term);
    console.log('fake item param', this.selectParams(term))
    let data =  await this.api.getItemPagination_Smart(this.selectParams(term)).toPromise().then();
    console.log('returnData', data.result);
    return data.result;
  }
  
  
  // customSearchFn(term: string, item: any) { 
  //     term = term.toLowerCase();
  //     return item.ItemName.toLowerCase().indexOf(term) > -1
  // }

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

}
