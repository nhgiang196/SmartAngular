import { Component, OnInit } from '@angular/core';
import { UnitService } from 'src/app/core/services';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { environment } from 'src/environments/environment';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient } from '@angular/common/http';

const ApiUrl = environment.apiUrl;
@Component({
  selector: 'app-main-view-category',
  templateUrl: './main-view-category.component.html',
  styleUrls: ['./main-view-category.component.css']
})
export class MainViewCategoryComponent implements OnInit {

  selectBoxData:any;
  selected:any =1113820;
  constructor(private unitService:UnitService, httpClient: HttpClient) {
    let serviceUrl = `${ApiUrl}/Unit/TestSelect`;
    this.selectBoxData = new DataSource({
      store: createStore({
          key: "UnitId",
          loadUrl: serviceUrl
      }) ,
      paginate: true,
      pageSize: 2
    });
  //   this.selectBoxData = new DataSource({
  //     store: new CustomStore({
  //         key: "UnitId",
  //         load: (pa) => {
  //           console.log(pa)
  //             return httpClient.get(serviceUrl,{params:p})
  //             .toPromise().then();
  //         }
  //     })
  // });
  }

  ngOnInit() {
  }

  onValueChanged(e){
    console.log(e);
  }
}
