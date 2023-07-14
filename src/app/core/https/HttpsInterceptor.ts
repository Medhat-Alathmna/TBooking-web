import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";
import { BaseComponent, isSet } from '../base/base.component';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpsInterceptor extends BaseComponent implements HttpInterceptor {

   constructor(public messageService?: MessageService, public translates?: TranslateService) {
      super(messageService, translates)
   }

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      return next.handle(request)
         .pipe(

            tap(
               (event: any) => {
                  // console.log(request);
                  if (!request.url.includes('users/authenticate')) {


                     if (request.method == 'POST') {
                        if (event.status == 200) {
                           this.successMessage(isSet(event?.body?.message) ? event?.body?.message : this.trans('New Entry Added Successfully'))
                        }
                     }
                  }
                  if (request.method == 'PUT') {
                     if (event.status == 200) {
                        this.successMessage(isSet(event?.body?.message) ? event?.body?.message : this.trans('Entry Updated Successfully'))
                     }
                  }

               },
               (err: any) => {
                  if (err.status == 500) {
                     this.errorMessage(this.trans('Server Side Error'))
                  } else {
                     this.errorMessage(err?.error?.title)

                  }


               }
            )
         )
   }
}
