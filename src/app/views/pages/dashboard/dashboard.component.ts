import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { minimalize, showSideBar } from 'src/app/app.helpers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  listMenu: [] =[];

  constructor(private store: StoreService, private httpService: HttpClient,private router : Router) {
    this.store.loadMenu(null);
   }

  ngOnInit() {
    this.loadData();
  }


  loadData(){
    this.httpService.get('/assets/data/data-categories-test.json').subscribe(
      data => {
        this.listMenu = data as [];
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
  }

  loadLink(item){
    this.store.loadMenu(item.id);
    this.router.navigate([item.link]);
  }


}
