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
    
    this.api.getItemPagination_Grid().subscribe(res=>{
      this.Items = res.result as any
      console.log(res)
    });

  }
}
