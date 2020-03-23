import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({providedIn: 'root'})
//* Service này chia sẻ data giữa các component không có mối quan hệ cha con */
export class StoreService {
  private listMenu = new BehaviorSubject<any>([]);
  currentMenus = this.listMenu.asObservable();

  constructor(private httpService: HttpClient) { }

   loadMenu(id) {
     if(id==null){
       this.listMenu.next([]);
     }
     this.httpService.get('/assets/data/data-child-menu.json').subscribe(
        data => {
          var result = data as any;
          this.listMenu.next(result.filter(x=>x.moduleId == id));
        },
        (err: HttpErrorResponse) => {
          console.log (err.message);
        }
      );;

  }

}
