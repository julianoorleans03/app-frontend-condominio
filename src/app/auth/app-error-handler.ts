import { ErrorHandler, Inject, Injector, Injectable } from "@angular/core";
import { UtilService } from "../service/util.service";
import { AuthService } from "../service/auth.service";

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  private get utilService(): UtilService {
    return this.injector.get(UtilService);
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  handleError(error) {
    console.error(error);
    console.error(error.message);

    let message =
      "Algo inesperado aconteceu, por favor, tente novamente mais tarde.";

    if (error && error.status == 401) {
      message = "Sem token de autenticação faça o login novamente !";
      this.authService.logout();
    } else if (error.status == 0) {
      message = "Servidor Indisponível!";
      this.authService.logout();
    }

    this.utilService.mostrarMensagemErro(message);
    super.handleError(error);
  }
}
