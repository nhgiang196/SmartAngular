import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
const url ='auth/v1/identity'
@Injectable({providedIn: 'root'})
export class AuthService {
  public nagClass: { mainViewToggle: boolean, emcsViewToogle: boolean }
  public currentUser: User;
  public labID = '513901200';
  redirectUrl: string;
  constructor(private http: HttpClient, private router: Router) {

    if (this.isLoggedIn()) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.currentUser = {
        Username: '',
        Password: '',
        Email: '',
        Specification: '',
        Department: '',
        Position: '',
        Nickname: '',
        Token: ''
      }
    }

    this.nagClass = {
      mainViewToggle: false
      , emcsViewToogle: false
    };

    
  }


  isLoggedIn() {
    return localStorage.getItem('currentUser') != null;
  }
  isLabUser(){
    return this.currentUser.Department == this.labID ? true: false;
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('login');
  }
  login =() =>  this.http.post(`${url}/loginSharePoint`, this.currentUser);  
  ldapLogin =() =>  this.http.post(`${url}/ldapLogin`, this.currentUser); 
  LDAP =() =>  this.http.post(`${url}/ldap`, this.currentUser); 
  register = (entity) =>this.http.post(`${url}/register`, entity);  
  forgotPassword = (email)=> this.http.get(`${url}/forgotPassword?Email=${email}`);
  resetPassword = (entity)=> this.http.put(`${url}/resetPassword`, entity);
  refreshToken = (entity)=> this.http.post(`${url}/forgotPassword`, entity);
  profile =() => this.http.post(`${url}/getInfoSharePoint`, this.currentUser);

}
