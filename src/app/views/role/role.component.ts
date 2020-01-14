import { Component, OnInit } from '@angular/core';
import  {collapseIboxHelper} from '../../app.helpers';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    
   

  
  }

  
  ngAfterViewInit(){
    collapseIboxHelper();
  }


  

}
