import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Achadoperdido } from '../model/achadoperdido.model';
import { AchadoperdidoService } from '../service/achadoperdido.service';
import { AuthService } from '../service/auth.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-achadosperdidos',
  templateUrl: './achadosperdidos.component.html',
  styleUrls: ['./achadosperdidos.component.scss']
})
export class AchadosperdidosComponent implements OnInit {

  itens: Array<Achadoperdido>;
  constructor(
    private router: Router,
    private achadoperdidoService: AchadoperdidoService,
    private utilService: UtilService,
    public authService: AuthService) { }

    async ngOnInit(): Promise<void> {
      await this.buscar();
    }
  
    async buscar(): Promise<void> {
      this.achadoperdidoService
        .buscar()
        .then((response) => {
          this.itens = response;
          this.itens = this.itens.filter(item => { return !item.usuarioRetirada})
        });
    }


    async entregar(item: Achadoperdido): Promise<void> {
      console.log(item);
      item.usuarioRetirada = this.authService.retornaIdUsuarioLogin();
      this.achadoperdidoService.entregar(item).subscribe(() => {
        this.utilService.mostrarMensagemSucesso("Entregue com Sucesso.");
        this.buscar();
      });
    }

    cadastrar(): void {
      this.router.navigate(["/achadosperdidos-cadastrar"]);
    }
}
