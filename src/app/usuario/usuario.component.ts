import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { UtilService } from '../service/util.service';

declare const jQuery: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  title: string;

  usuario: Usuario;

  salvando: boolean;

  @ViewChild("form") form;
  constructor(private usuarioService: UsuarioService,
    private utilService: UtilService,
    public authService: AuthService) { }

    async ngOnInit() {
      const idUsuario = this.authService.retornaIdUsuarioLogin();
      this.usuario = new Usuario();
      
      await this.usuarioService.buscarPorId(idUsuario).then(response => {
        if (response) {
          this.usuario = response;
        } else {
          this.usuario = new Usuario();
        }
      });
  
      this.title = "Cadastro de Usuario";
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
  
      this.usuarioService.salvar(this.usuario).subscribe(response => {
        this.utilService.mostrarMensagemSucesso("Usuário salvo com sucesso!");
      });
    }
}
