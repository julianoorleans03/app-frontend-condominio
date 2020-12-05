import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../model/usuario.model';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { UtilService } from '../service/util.service';

declare const jQuery: any;

@Component({
  selector: 'app-novousuario',
  templateUrl: './novousuario.component.html',
  styleUrls: ['./novousuario.component.scss']
})
export class NovousuarioComponent implements OnInit {
  title: string;

  usuario: Usuario;

  salvando: boolean;

  @ViewChild("form") form;
  constructor(private usuarioService: UsuarioService,
    private utilService: UtilService,
    public authService: AuthService,
    private router: Router) { }

  async ngOnInit() {
    this.usuario = new Usuario();
    this.title = "Novo Usuario";
  }

  salvar(): void {
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

    if (this.usuario.email) {
      if (!this.utilService.validarEmail(this.usuario.email)) {
        this.utilService.mostrarMensagemAlerta(
          `E-mail ${this.usuario.email} inválido !`
        );
        jQuery("#email").focus();
        return;
      }
    }

    this.usuario.tipo = "user";
    this.usuario.ativo = false;
    this.authService.criarConta(this.usuario);
  }

  voltar(): void {
    this.router.navigate(["/"])
  }
}