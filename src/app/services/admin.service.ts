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

  addPolicy = (entity) => this.http.post(`${url}/addPolicy`,entity);
  addPoliciesToRoles = (entity) => this.http.post(`${url}/addPoliciesToRoles`,entity);
  removeRole = (roleName) => this.http.delete(`${url}/removeRole/${roleName}`);
  createRole = (roleName) => this.http.post(`${url}/createRole`,roleName);
  addUserToRole = (entity) => this.http.post(`${url}/addToRole`,entity);
  removeUserToRole = (entity) => this.http.delete(`${url}/removeUserToRole/${entity.Username}`,entity);  
  getRoles = () => this.http.get<any>(`${url}/getRoles`);
  lockAccount = (entity) => this.http.put<any>(`${url}/lockAccount`,entity);
  deleteAccount = (userName) => this.http.delete<any>(`${url}/deleteAccount/${userName}`);
  getUsersInRoleAsync = (roleName) => this.http.get<any>(`${url}/getUsersInRoleAsync?roleName=${roleName}`);
  getRolesUserAsync = (userName) => this.http.get<any>(`${url}/getRolesAsync?userName=${userName}`);
  getPoliciesInRoleAsync = (roleName) => this.http.get<any>(`${url}/getPoliciesInRoleAsync?roleName=${roleName}`);
  resetPasswordAsync = (entity) => this.http.post<any>(`${url}/resetPasswordAsync`,entity);
  sendMailAsync = (entity) => this.http.post<any>(`${url}/sendMailAsync`,entity);
  sendMail= (entity) => this.http.post<any>(`${url}/sendMail`,entity);
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