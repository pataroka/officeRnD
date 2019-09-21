import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // tslint:disable-next-line:max-line-length
    private readonly TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkODM5MzJiZTU5YmU1MjcwNGMzMGZhOSIsImlhdCI6MTU2ODkwMzk3OSwiZXhwIjoxNjAwNDM5OTc5fQ.H4VdCyUQ4om4lhKHRqrcG09UCwV1jlpKEy_ixfuBRx4';

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authReq: HttpRequest<any> = req.clone({
            headers: req.headers.set('Authorization', this.TOKEN)
        });

        return next.handle(authReq);
    }
}
