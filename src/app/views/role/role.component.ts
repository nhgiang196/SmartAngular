import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private trans: TranslateService


  ) { }

  /******************************************DECLARATION *******************************************/
  loading = false;
  list = {
    Users:[],
    Roles:[]
  };
  searchParams = {
    User:''
  };
  /******************************************Init *******************************************/
  ngOnInit() {
    this.loadUsers();
    this.loadRoles()
  }
  loadUsers(){
    this.list.Users = [
      {id: 'nhgiang', name: 'nhgiang'},
      {id: 'nhgiang3', name: 'uSER 3'},
    ];
  }
  loadRoles(){
    this.authService.getRole().subscribe(res=>{
      console.log(res);
      this.list.Roles = res;
    })
  }
  /******************************************Functions *******************************************/


  
  


  /******************************************On change event *******************************************/
  selectOnChange(){
    console.log(this.searchParams);
    this.loading = true;
    


    
  }

  

}
