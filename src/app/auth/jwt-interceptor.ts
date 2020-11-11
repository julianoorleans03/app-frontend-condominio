import { AuthService } from '../service/auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authService.estaLogado()) {
      request = request.clone({
        setHeaders: {
          "x-access-token": `${this.authService.recuperarToken()}`,
        }
      });
    }
    return next.handle(request);
  }
}
