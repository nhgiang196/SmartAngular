import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
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
  assignRole(userID: string,roleID: string,check: boolean ){
    this.adminService.toogleRole(userID,[roleID],check).toPromise().then(res=>{
      console.log(res);
      if (res['errors']!=null)
      {
        let errTitle= this.trans.instant('Role.Error_RoleAdd');
        this.toastr.error(res['errors'][0],errTitle);
      }
      else 
      {
        let errTitle= this.trans.instant('Role.Success_RoleAdd');
        this.toastr.success(errTitle);
      }
      this.selectOnChange();
      }).catch(err=>{
        this.toastr.error(err.message,err.statusText+': '+err.status);
        
      })
  }
  /******************************************On change event *******************************************/
  selectOnChange(){
    console.log(this.searchParams);
    var _user= this.searchParams.User;
    if (_user=='' || _user==null) return;
    this.loading = true;
    this.adminService.getRoleByUser(_user).toPromise().then(res=>{
      console.log(res);
      this.entity.UserInRole = res;
      this.loading= false;
    }).catch(err=>{
      this.toastr.error(err.message,err.statusText+': '+err.status);
    });


    
  }
  



  

}
