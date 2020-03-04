import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Item, Files } from 'src/app/models/SmartInModels';
import { environment } from 'src/environments/environment';
declare let $: any;

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  item?: Item = new Item;
  Files?: Files[] = []
  baseUrl:string = environment.apiUrl;
  listImgs: string[]= [];
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1};
  
  
  constructor(private api: WaterTreatmentService, private router: ActivatedRoute,private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.item = this.route.snapshot.data["item"];
    this.getAllImageFiles();
  }
  //get All File with Image is true
  getAllImageFiles() {
    let itemFiles = this.item.ItemFile.filter(x => x.IsImage == true);
    this.listImgs =itemFiles.map(file =>{
      return this.baseUrl + file.File.Path;
    });
  }

}
