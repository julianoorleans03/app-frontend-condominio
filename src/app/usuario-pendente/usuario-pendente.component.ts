import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-usuario-pendente',
  templateUrl: './usuario-pendente.component.html',
  styleUrls: ['./usuario-pendente.component.scss']
})
export class UsuarioPendenteComponent implements OnInit {

  usuario: Array<Usuario>;
  constructor(
    private usuarioServie: UsuarioService,
    private utilService: UtilService) { }

    async ngOnInit(): Promise<void> {
      await this.buscar();
    }
  
    async buscar(): Promise<void> {
      this.usuarioServie
        .buscar()
        .then((response) => {
          this.usuario = response;
          console.log(this.usuario);
          this.usuario = this.usuario.filter(item => { return !item.ativo})
        });
    }

    async ativar(item: Usuario): Promise<void> {
      this.usuarioServie.ativar(item).subscribe(() => {
        this.utilService.mostrarMensagemSucesso("Ativo com Sucesso.");
        this.buscar();
      });
    }
}
