import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Item, Files } from 'src/app/models/SmartInModels';
declare let $: any;

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  item?: Item 
  Files?: Files[] = []
  url : string ='http://localhost:3333/'
  constructor(private api: WaterTreatmentService, private router: ActivatedRoute) { }

  ngOnInit() {

    $('.product-images').slick({
      dots: true
    });
    this.item = new Item;
    this.loadItemDetail()
  }
  async loadItemDetail() {
    let id
    this.router.params.subscribe(params => {
      id = params.id;
    });
    this.item = await this.api.findItemById(id).toPromise().then() as any;
    this.Files = this.getAllImageFiles();
    console.log(this.item);
  }
  //get All File with Image is true
  getAllImageFiles() {
    let itemFiles = this.item.ItemFile.filter(x => x.IsImage == true);
    let listFiles: Files[] = []
    itemFiles.forEach(file => {
      file.File.Path = this.url + file.File.Path;
      listFiles.push(file.File)
    })
    return listFiles;
  }

}
