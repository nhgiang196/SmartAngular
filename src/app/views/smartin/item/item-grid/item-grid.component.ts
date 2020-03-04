import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/SmartInModels';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-grid',
  templateUrl: './item-grid.component.html',
  styleUrls: ['./item-grid.component.css']
})
export class ItemGridComponent implements OnInit {
  baseUrl:string = environment.apiUrl;
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
  getUrlImage(item){
    var getItem = item as Item;
    var fileImages = getItem.ItemFile.filter(x=>x.IsImage ==true);
    if(fileImages.length>0){
      return this.baseUrl + fileImages[0].File.Path;
    }
    return "assets/img/empty.jpg";
  }
}
