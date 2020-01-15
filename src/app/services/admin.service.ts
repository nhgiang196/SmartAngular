import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';




const url = "api/v1/admin"


@Injectable({providedIn: 'root'})
export class AdminService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {

    
   }

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
      'Authorization': "Bearer "+ this.authService.currentUser.Token
    })
  }

  getRoleByUser(username: string)
  {
    var option = this.httpOptions;
    return this.http.get<any>(`${url}/getRolesAsync`,{
      params:{username:username},
      headers: option.headers
    });
  }
  getUsers()
  {
    var option = this.httpOptions;
    return this.http.get<any>(`${url}/getUsers`,option);
  }

  getRoles()
  {
    var option = this.httpOptions;
    return this.http.get<any>(`${url}/getRoles`,option);
  }

  toogleRole(Username: string, roles: string[],toogleValue: boolean)
  {
    var urlString = toogleValue? 'addtoRole': 'removeToRole';
    var method = toogleValue? 'POST': 'DELETE';
    return this.http.request(method,`${url}/${urlString}`,{
      body:{
        Username:Username,
        roles:roles
      },
      headers: this.httpOptions.headers,
      params:{
        Username:Username,
        roles:roles
      }
    },
    );

  }



  
 


  
 





   


  




  
}