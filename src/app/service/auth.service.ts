import * as JWT from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { UsuarioLogin } from '../model/usuario-login.model';
import { UtilService } from './util.service';
import { environment } from "src/environments/environment";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router,
    private localStorageService: LocalStorageService, private utilService: UtilService, public afAuth: AngularFireAuth) { }

  doFacebookLogin() {
    let provider = new firebase.default.auth.FacebookAuthProvider();
    
    this.afAuth.signInWithPopup(provider).then(res => {

      let usuario: Usuario = new Usuario();
      usuario.email = res.user.email;
      usuario.senha = res.user.email;
      usuario.facebook = true;
      this.acessar(usuario);
    }).catch(error => {
      console.log(error);
    })
  }

  acessar(usuario: UsuarioLogin): void {
    this.http.post<any>(`${environment.api}/usuario/autenticar`, usuario).subscribe(
      (response) => {
        this.utilService.mostrarMensagemSucesso("Usuário logado com sucesso !");
        this.localStorageService.setToken(response.token);
        this.router.navigate(["/"]);
      },
      (error) => {
        if (error && error.status == 401) {
          this.utilService.mostrarMensagemAlerta(
            error.error.message
          );
        } else if (error.status == 0) {
          this.utilService.mostrarMensagemErro("Servidor Indisponível!");
        }
      }
    );
  }

  criarConta(usuario: UsuarioLogin): void {

    if (usuario.email && usuario.senha) {
      this.http.post<any>(`${environment.api}/usuario`, usuario).subscribe(
        (response) => {
          this.utilService.mostrarMensagemSucesso("Usuário criado com sucesso. Aguarde a liberação do ADM!");
        },
        (error) => {
          if (error && error.status == 401) {
            this.utilService.mostrarMensagemAlerta(
              error.error.message
            );
          } else if (error.status == 0) {
            this.utilService.mostrarMensagemErro("Servidor Indisponível!");
          }
        }
      );
    }
  }

  recuperarToken(): string {
    return this.localStorageService.getToken();
  }

  estaLogado(): boolean {
    return !!this.recuperarToken();
  }

  navegarParaLogin(): void {
    this.router.navigate(["/login"]);
  }

  logout(): void {
    this.navegarParaLogin();
    this.localStorageService.clearAll();
  }

  retornaIdUsuarioLogin(): string {
    return JWT(this.recuperarToken())["id"];
  }

  retornaNomeUsuario(): string {
    return JWT(this.recuperarToken())["nome"];
  }

  retornaEmailUsuario(): string {
    return JWT(this.recuperarToken())["email"];
  }

  retornaGrupoUsuario(): string {
    return JWT(this.recuperarToken())["tipo"];
  }

  ehUsuarioAdministrador(): boolean {
    return this.retornaGrupoUsuario() == "admin";
  }

  ehUsuarioSuporte(): boolean {
    return !(this.retornaGrupoUsuario() == "admin");
  }
}
