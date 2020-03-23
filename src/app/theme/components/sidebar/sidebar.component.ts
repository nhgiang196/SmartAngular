import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';
import { metisMenuRender } from 'src/app/app.helpers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  listMenu = [];
  constructor(private store: StoreService) { }

  ngOnInit() {
    this.renderMenu();
  }

  renderMenu(){
    this.store.currentMenus.subscribe(res=>{
      this.listMenu = res;
    })
  }

}
