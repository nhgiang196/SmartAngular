import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ItemService, AuthService, ItemTypeService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemType } from 'src/app/core/models/item';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource: any;
  listItemType: Array<ItemType> = new Array<ItemType>();
  constructor(
    private itemService: ItemService,
    private itemTypeService: ItemTypeService,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = this.itemService.getDataGridItem(this.dataSource, 'ItemId');
  }
  async ngOnInit() {
    await this.getAllItemType();
  }

  onRowUpdating(event){
    console.log(event)
  }
  onRowRemoving(event){
    console.log(event);
  }
  onEditingStart(event){
    this.router.navigate(['/pages/category/item/action/'+event.data.ItemId])
    console.log(event);
  }

  async getAllItemType() {
    this.listItemType = await this.itemTypeService.getItemType().pipe(map(res => {
      return res as Array<ItemType>;
    })).toPromise().then();
  }

  searchItemByItemType(id){
    let fillter = id!=0?'["ItemTypeId", "=",'+id+']':'';
    this.dataSource= this.itemService.getDataGridItem(this.dataSource, 'ItemId',fillter)
  }
}
