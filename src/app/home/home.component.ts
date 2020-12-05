import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { UtilService } from '../service/util.service';

declare const jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  notificacao: string;
  assunto: string;
  usuario: any;
  usuarios: Array<Usuario> = new Array();
  salvando: boolean;
  @ViewChild("form") form;
  constructor(public authService: AuthService, private usuarioService: UsuarioService, private utilService: UtilService) { }

  ngOnInit(): void {
  }

  enviar(): void {
    this.salvando = true;
    if (this.form.invalid) {
      this.utilService.mostrarMensagemAlerta(
        "Por favor, preencha todos os campos obrigatórios."
      );
      jQuery(".is-invalid")
        .filter(":input:first")
        .focus();
      return;
    }
    this.usuarios.forEach(usuario => {
      this.usuarioService.enviarNotificacao({ notificacao: this.notificacao, assunto: this.assunto, emailNotificacao: usuario.emailNotificacao }).subscribe(response => {
        this.utilService.mostrarMensagemSucesso(response.message);
      });
    });
    this.salvando = false;
  }

  adicionarUsuario(): void {

    let index = this.usuarios.findIndex((usuarioArray) => { return usuarioArray._id == this.usuario.id });

    if (index == -1) {
      this.usuarios.push(this.usuario);
    }
  }

  remover(index): void {
    this.usuarios.splice(index, 1);
  }
}
