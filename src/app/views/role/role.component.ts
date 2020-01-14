import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(
    private adminService: AdminService,
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
  entity = {
    UserInRole : []
  }
  /******************************************Init *******************************************/
  ngOnInit() {
    this.loadUsers();
    this.loadRoles()
  }
  loadUsers(){
    this.adminService.getUsers().subscribe(res=>{
      console.log(res);
      this.list.Users = res;
    });
  }
  loadRoles(){
    this.adminService.getRoles().subscribe(res=>{
      console.log(res);
      this.list.Roles = res;
    })
  }
  /******************************************Functions *******************************************/


  
  


  /******************************************On change event *******************************************/
  selectOnChange(){
    console.log(this.searchParams);
    var _user= this.searchParams.User;
    this.loading = true;
    
    this.adminService.getRoleByUser(_user).toPromise().then(res=>{
      console.log(res);
      this.entity.UserInRole = res;
      this.loading= false;
    }).catch(err=>{

    });


    
  }
  assignRole_OnChange(roleID: string, userID: string){

  }



  

}
