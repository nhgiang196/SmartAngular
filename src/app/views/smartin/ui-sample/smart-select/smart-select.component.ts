import { Component, OnInit, Input, Output, EventEmitter, ɵConsole, SimpleChanges, OnChanges } from '@angular/core';
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

export class SmartSelectComponent implements OnInit ,OnChanges  {
  @Input('name') name: string;
  /** Tên danh sách hoặc thực thể 
   * @example : 'Item'
  */
  @Input('listName') entityString : string ;
   /** Giá trị placeholder được translate
     * @example : 'Item'
     */
  @Input('placeholder')  translatePlaceholder : string = '';
  /** Mã đặc biệt, phòng trương hợp bị trống do đổi status */
  @Input('specialId') specialId : number ;
  /** Kết quả trả về
   * @example: itemID = $event
   */
  @Output('select_ngModel') send_value = new EventEmitter<SmartItem>();
  

  constructor(private api: WaterTreatmentService) { }

  /**Dấu hiệu load */
  loading = false;
  /**Trang load cộng*/
  page = 1
  /** keyWord */
  keyword =null
  /** Total count */
  totalCount : number = 0;
  /**Check giá trị nhập */
  input$ = new Subject<string>();
  /** Số item còn sót lại để thực hiện tác vụ load tiếp tục */
  numberOfItemsFromEndBeforeFetchingMore = 10;
  /** Số dòng */
  bufferSize = 50; 
  /** Danh sách item sau khi lọc*/
  itemsBuffer : SmartItem[]=[];
  /**Giá trị chọn */
  chooseItem : SmartItem

  async ngOnInit() { 
    // await this.loadInit();
    ; //input Event
  }
  async loadInit() {
    this.chooseItem = new SmartItem();
    var pr = this.selectParams();
    let res =  await this.api.getItemPagination_Smart(pr).toPromise().then() as any; 
    this.totalCount = res.totalCount;
    this.itemsBuffer =  res.result || [];
    this.chooseItem.id = this.specialId ;
    this.onSearch()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.specialId.firstChange) {
      this.loadInit();
      return;
    }
    
    
  }

  /** ACIENT CODES, DON'T CHANGE!! */
  private selectParams(keyword: string = null, page: number = 0){
    var pr = new DataTablePaginationParams();
    let conditionString = ' ';
    let specialString = ' ';
    let statusString = ' ';
    pr.pageSize = this.bufferSize;
    if (page) pr.page = (page-1)* pr.pageSize; // recordRow from
    switch (this.entityString) {
      case 'ItemOut':
        pr.selectFields = "[id] = ItemId, [text] =  ItemNo + ' '  + ItemName ";
        pr.entity = 'Item';
        pr.orderBy=' ItemNo';
        if (keyword) conditionString = ` ItemNo  +' '+ ItemName LIKE N'%${keyword}%'` ;
        if (this.specialId)  {
          specialString =  `ItemId= ${ this.specialId}`;
          pr.orderBy = `IIF(ItemId=  ${ this.specialId}, ItemNo, ItemID)`;
          pr.orderDir = 'asc';
        } 
        statusString = (keyword? ' AND ' : ' ') +' ItemTypeId=3';
        break;
      case 'Item':
        pr.selectFields = "[id] = ItemId, [text] =  ItemNo + ' '  + ItemName ";
        pr.entity = 'Item';
        pr.orderBy='ItemNo';
        if (keyword) conditionString = ` ItemNo  +' '+ ItemName LIKE N'%${keyword}%'` ;
        if (this.specialId) {  
          specialString =  `ItemId= ${ this.specialId}`;
          pr.orderBy = `IIF(ItemId=  ${ this.specialId}, ItemNo, ItemID)`;
          pr.orderDir = 'asc';
        }
        break;
      case 'Users':
        pr.selectFields = "[id]= UserName, [text] = NormalizedUserName";
        pr.entity = '[BCM_Auth].dbo.AspNetUsers';
        pr.orderBy='NormalizedUserName'; //Department Later
        if (keyword) conditionString = `  NormalizedUserName LIKE N'%${keyword}%'` ;
        if (this.specialId) { 
          specialString =  `UserName= ${ this.specialId}`;
          pr.orderBy = `IIF(UserName=  ${ this.specialId}, UserName, NormalizedUserName)`;
          pr.orderDir = 'asc';
        }
        break;
      case 'Factory':
        pr.selectFields = "[id] = FactoryId, [text] = FactoryName";
        pr.entity = 'Factory';
        pr.orderBy='FactoryBuiltDate'; 
        pr.orderDir ='desc';
        if (keyword) conditionString = `  FactoryName LIKE N'%${keyword}%'` ;
        if (this.specialId) {
          specialString =  `FactoryId= ${ this.specialId}`;
          pr.orderBy = `IIF(FactoryId=  ${ this.specialId}, FactoryId, FactoryBuiltDate)`;
          pr.orderDir = 'asc';
        }
        statusString = (keyword? ' AND ' : ' ') +' Status=1';
        break;
      case 'Unit':
        pr.selectFields = " [id] = UnitId, [text] = UnitName";
        pr.entity = 'Unit';
        pr.orderBy='CreateDate'; 
        pr.orderDir ='desc';
        if (keyword) conditionString = `  UnitName LIKE N'%${keyword}%'` ;
        if (this.specialId) {
          specialString =  `UnitId= ${ this.specialId}`;
          pr.orderBy = `IIF(UnitId=  ${ this.specialId}, UnitId, CreateDate)`;
          pr.orderDir = 'asc';
        }

        statusString = (keyword? ' AND ' : ' ') +' Status=1';
        break;
    }
    pr.specialCondition = conditionString+ statusString + ((keyword || statusString!=' ') && this.specialId? ' OR ' + specialString: '') 
    return pr;
  }

  onChange(event){
    this.chooseItem.text =   event? event.text :'';
    this.send_value.emit(this.chooseItem);
  }
  
  onSearch(){ 
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(), 
      switchMap(term =>  this.fakeService(term))
    ).subscribe(data => {
        this.totalCount  =data.totalCount;
        this.itemsBuffer= data.result || [];
        this.loading = false;
      })
  }

  private async  fakeService(term) { 
    this.keyword = term;
    this.page=1;
    this.loading = true;
    let data =  await this.api.getItemPagination_Smart(this.selectParams(term)).toPromise().then();
    return data;
  }

  onScrollToEnd() { 
    this.fetchMore();
  }

  onScroll({ end }) { 
    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.itemsBuffer.length)
        this.fetchMore();
  }
  private async fetchMore() { 
    if (this.loading || this.totalCount <= this.itemsBuffer.length){
      return;
    } 
    this.loading = true;
    let data =  await this.api.getItemPagination_Smart(this.selectParams(this.keyword,++this.page)).toPromise().then();
    this.loading = false;     
    this.itemsBuffer = this.itemsBuffer.concat(data.result || []);
    // setTimeout(() => { //reduce server performance
    // }, 200)
  }

}
