import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ItemService, AuthService, ItemTypeService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemType } from 'src/app/core/models/item';
import { map } from 'rxjs/operators';
import { DevextremeService } from 'src/app/core/services/general/devextreme.service';
import swal from "sweetalert2";
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  dataSource: any;
  listItemType: Array<ItemType> = new Array<ItemType>();
  itemTypeId:number;
  constructor(
    private itemService: ItemService,
    private itemTypeService: ItemTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private devExtreme: DevextremeService
  ) {
    this.rediactToAction = this.rediactToAction.bind(this);
  }
  async ngOnInit() {
    await this.getAllItemType();
    this.itemTypeId = this.route.snapshot.params.id || 0;
    this.dataSource = this.devExtreme.loadDxoGrid('Item',"GetItemDataGridPagination","DeleteItem");
    if(this.itemTypeId!=0){
      this.searchItemByItemType(this.itemTypeId);
    }

  }


  async getAllItemType() {
    this.listItemType = await this.itemTypeService.getAll().pipe(map(res => {
      return res as Array<ItemType>;
    })).toPromise().then();
  }

  searchItemByItemType(id){
    let filter = id!=0?["ItemTypeId", "=",id]:[];
    this.dataSource.filter(filter);
    this.dataSource.reload();
  }

  rediactToAction(event){
    this.router.navigate(['/pages/category/item/action/'+event.row.data.ItemId])
  }

  onDataErrorOccurred(err){
    swal.fire("Validate", "Xóa thất bại do ràng buộc khóa", "error");
  }
}
