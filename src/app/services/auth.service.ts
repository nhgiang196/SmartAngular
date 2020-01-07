import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public nagClass: { mainViewToggle: boolean, emcsViewToogle: boolean }
  public currentUser: User;
  redirectUrl: string;
  constructor(private http: HttpClient,private router:Router) {
   if(this.isLoggedIn())
   {
      this.currentUser = JSON.parse( localStorage.getItem('currentUser'));
   }else{
    this.currentUser={
      Username:'',
      Password:'',
      Email:'',
      Token:''
    }
   }
   this.nagClass = {
    mainViewToggle: false
  , emcsViewToogle: false };


  }
  isLoggedIn()
  {
    return localStorage.getItem('currentUser') != null;
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('login');
  }
  login() {
    return this.http.get('api/HSSE/ValidateUser',{
      params:{
        username: this.currentUser.Username,
        password: this.currentUser.Password
      }
    });
  }
  checkTcode(Tcode){
    return this.http.get<boolean>(`api/HSSE/CheckTCode`,{
      params:{
        username: this.currentUser.Username,
        tcode:Tcode
      }
    })
  }
}