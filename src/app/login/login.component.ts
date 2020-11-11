import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioLogin } from '../model/usuario-login.model';
import { AuthService } from '../service/auth.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario: UsuarioLogin = new UsuarioLogin();
  logando: boolean;

  constructor(private authService: AuthService,
    private utilService: UtilService,
    private router: Router) { }

  ngOnInit(): void {
  }

  entrar(usuario: UsuarioLogin): void {
    this.logando = true;

    this.authService.acessar(usuario);
  }

  irParaModulos() {
    sessionStorage.clear();

    this.router.navigate(["/"]);
  }

}
