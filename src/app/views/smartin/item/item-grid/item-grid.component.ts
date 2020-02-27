import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';

@Component({
  selector: 'app-item-grid',
  templateUrl: './item-grid.component.html',
  styleUrls: ['./item-grid.component.css']
})
export class ItemGridComponent implements OnInit {

  Items?: Item[] = [];
  constructor(private api: WaterTreatmentService) { }

  ngOnInit() {
    this.loadItems();
  }
  loadItems(){
    this.api.getItem().subscribe(res=>{
      this.Items = res as any
      console.log(res)
    });

  }

}
