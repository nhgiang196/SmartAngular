import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
    $('body').addClass('gray-bg');    
    $('.footer').addClass('fixed');    
    $('.footer').css('margin-left', 0);    
    
    $('.theme-config').remove();
  }

  ngOnDestroy() {
    $('body').removeClass('gray-bg');
  }

}
