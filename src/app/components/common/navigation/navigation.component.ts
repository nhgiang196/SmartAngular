import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }

}
