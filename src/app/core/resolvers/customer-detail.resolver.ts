import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../services';
import { Customer } from '../models/customer';


@Injectable({
  providedIn: 'root',
})
export class CustomerDetailResolverService implements Resolve<Customer> {

constructor(private api: CustomerService, private router: Router,
        private toastr: ToastrService) {}

  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> {
    return  this.api.findCustomerById(router.params['id'])
      .pipe(
      map(item=>{ return item;
      }),
      catchError(error => {
          this.toastr.error(error);
          return of(null);
      })
  );

  }


}

