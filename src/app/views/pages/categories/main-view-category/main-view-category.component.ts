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
  constructor(private unitService:UnitService, httpClient: HttpClient) {
  }
  ngOnInit() {
  }
}
