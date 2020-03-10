import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer } from 'src/app/models/SmartInModels';
import { Injectable } from '@angular/core';
import { WaterTreatmentService } from 'src/app/services/api-watertreatment.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class CustomerDetailResolverService implements Resolve<Customer> {

constructor(private api: WaterTreatmentService, private router: Router,
        private toastr: ToastrService) {}

  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Customer> {
    debugger;
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

