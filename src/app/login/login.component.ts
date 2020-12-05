import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioLogin } from '../model/usuario-login.model';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario: UsuarioLogin = new UsuarioLogin();
  logando: boolean;

  constructor(private authService: AuthService,
    private router: Router) { }

  entrar(usuario: UsuarioLogin): void {
    this.logando = true;
    this.authService.acessar(usuario);
  }

  criarConta(usuario: UsuarioLogin): void {
    usuario.nome = usuario.email;
    usuario.tipo = "user";
    this.authService.criarConta(usuario);
  }

  novoUsuario() {
    this.router.navigate(["/criar-conta"]);
  }
  
  entrarComFacebook() {
    this.authService.doFacebookLogin();
  }

  irParaModulos() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
  }
}
