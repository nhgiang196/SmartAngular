import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FunctionService } from '../function.service';

@Injectable({providedIn: 'root'})
//* Service này chia sẻ data giữa các component không có mối quan hệ cha con */
export class StoreService {
  private listMenu = new BehaviorSubject<any>([]);
  currentMenus = this.listMenu.asObservable();

  constructor(private functionService: FunctionService) { }

   loadMenu(code) {
     if(code==null){
       this.listMenu.next([]);
     }
     this.functionService.getFuntionByModuleCode(code).subscribe(
        data => {
          var result = data as any;
          this.listMenu.next(result);
        },
        (err: HttpErrorResponse) => {
          console.log (err.message);
        }
      );;

  }

}
