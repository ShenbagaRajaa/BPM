import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CommonService } from '../services/common.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(CommonService)

    spinnerService.show();
    return next(req).pipe(  
    finalize(() => spinnerService.hide()) 
  );
};
