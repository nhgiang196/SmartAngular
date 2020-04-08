import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { minimalize, showSideBar, hideNavBar } from 'src/app/app.helpers';
import { ModuleService } from 'src/app/core/services';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  listMenu: [] =[];

  constructor(private store: StoreService, 
    private moduleService :ModuleService,
    private router : Router,
    public langService: LanguageService) {
    this.store.loadMenu(null);
   }

  ngOnInit() {
    //hideNavBar();
    this.loadData();
  }


  loadData(){
    this.moduleService.getAllModule().subscribe(
      data => {
        this.listMenu = data as [];
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
  }


}
