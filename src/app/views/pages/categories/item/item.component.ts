import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ItemService, AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';
import config from 'devextreme/core/config';
import { directions } from 'src/app/core/helpers/DevExtremeExtention';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  dataSource: any;
  url: string;
  masterDetailDataSource: any;
  selectedRowIndex = -1;
  constructor(
    private api: ItemService,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = this.api.getDataGridItem(this.dataSource, 'ItemId');
  }
  ngOnInit() {
  }

  onRowUpdating(event){
    console.log(event)
  }
  onRowRemoving(event){
    console.log(event);
  }
  onEditingStart(event){
    console.log(this.route.snapshot);
    let cid =  this.route.snapshot.paramMap.get("cid");
    this.router.navigate(['/pages/'+cid+'/category/item/action'])
    console.log(event);
  }
}
