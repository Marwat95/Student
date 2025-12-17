import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Only log support-related requests for debugging
  if (req.url.includes('/support/')) {
    console.log('📤 HTTP Request:', {
      method: req.method,
      url: req.url,
      params: req.params
    });
  }

  return next(req).pipe(
    tap((event) => {
      if (req.url.includes('/support/') && event instanceof HttpResponse) {
        console.log('📥 HTTP Response:', {
          url: req.url,
          status: event.status,
          body: event.body
        });
      }
    })
  );
};
