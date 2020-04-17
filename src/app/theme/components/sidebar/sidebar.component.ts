import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/general/store.service';
import { metisMenuRender } from 'src/app/app.helpers';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  listMenu = [];
  constructor(private store: StoreService,private router : Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.renderMenu();
  }

  renderMenu(){
    this.store.currentMenus.subscribe(res=>{
      this.listMenu = res;
    })
  }

  loadLink(link){

      this.router.navigate([link]);


  }

}
