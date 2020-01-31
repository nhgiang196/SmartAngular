import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

const url = "auth/v1/admin"


@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getRoleByUser = (username: string) => this.http.get<any>(`${url}/getRolesAsync`, { params: { username: username } });
  getUsers = () => this.http.get<any>(`${url}/getUsers`);

  getRoles = () => this.http.get<any>(`${url}/getRoles`);
  resetPassword = (entity) => this.http.put(`${url}/resetPasswordAsync?userName=${entity.Username}&Password=${entity.Password}`,{body:{ userName: "xx", Password: "fdsfs" }});
  toogleRole(Username: string, roles: string[], toogleValue: boolean) {
    var urlString = toogleValue ? 'addtoRole' : 'removeToRole';
    var method = toogleValue ? 'POST' : 'DELETE';
    return this.http.request(method, `${url}/${urlString}`, {
      body: {
        Username: Username,
        roles: roles
      },
      params: {
        Username: Username,
        roles: roles
      }
    },
    );

  }

}