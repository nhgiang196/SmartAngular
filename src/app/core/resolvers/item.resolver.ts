import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Item } from '../models/item';
import { ItemService } from '../services';


@Injectable()
export class ItemResolver implements Resolve<Item> {
    constructor(private api: ItemService,
        private toastr: ToastrService) { }

    resolve(router: ActivatedRouteSnapshot): Observable<Item> {
        return  this.api.findById(router.params['id']).pipe(
            map(item=>{
                return item;
            }),
            catchError(error => {
                this.toastr.error(error);
                return of(null);
            })
        );
    }
}
