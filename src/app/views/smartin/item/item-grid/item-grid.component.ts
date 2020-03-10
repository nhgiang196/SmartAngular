import { Component, OnInit, PlatformRef } from '@angular/core';
import { Item , DataTablePaginationParams} from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { environment } from 'src/environments/environment';
import { PRIMARY_OUTLET } from '@angular/router';

@Component({
  selector: 'app-item-grid',
  templateUrl: './item-grid.component.html',
  styleUrls: ['./item-grid.component.css']
})
export class ItemGridComponent implements OnInit {
  baseUrl:string = environment['apiUrl'];
  Items?: any;
  constructor(private api: WaterTreatmentService) { }

  ngOnInit() {
    this.loadItems();
  }
  loadItems(){
    let pr = new DataTablePaginationParams();
    pr.pageSize=50;
    pr.page= 1;
    pr.selectFields = ` q.*, ItemTypeName, [FirstImagePath] = ISNULL((SELECT TOP 1 f.[Path] FROM ItemFile i JOIN [File] f ON f.FileID = i.FileID WHERE i.ItemID= q.ItemID AND I.IsImage=1),'assets/img/empty.jpg')`;
    pr.entity = ` Item q LEFT join ItemType t ON t.ItemTypeID=q.ItemTypeID `;
    pr.specialCondition = ` EXISTS( SELECT * FROM ItemFile jk WHERE jk.IsImage=1 AND jk.ItemID= q.ItemID) `;
    this.api.getItemPagination_Grid(pr).subscribe(res=>{
      this.Items = res.result as any
      console.log(res)
    });

  }
}
