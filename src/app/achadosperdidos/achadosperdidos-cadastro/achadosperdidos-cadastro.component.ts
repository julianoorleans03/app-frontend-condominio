import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Achadoperdido } from 'src/app/model/achadoperdido.model';
import { AchadoperdidoService } from 'src/app/service/achadoperdido.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-achadosperdidos-cadastro',
  templateUrl: './achadosperdidos-cadastro.component.html',
  styleUrls: ['./achadosperdidos-cadastro.component.scss']
})
export class AchadosperdidosCadastroComponent implements OnInit {
  achadoperdido: Achadoperdido;

  salvando: boolean;

  @ViewChild("form") form;

  title: string;
  constructor(    private router: Router,
    private utilService: UtilService,
    private achadoperdidoService: AchadoperdidoService) { }

    async ngOnInit(): Promise<void> {
      this.achadoperdido = new Achadoperdido();
      this.title = "Cadastrar Item - Achados e Perdidos";
    }

    salvar(): void {
      this.salvando = true;
  
      if (this.form.invalid) {
        this.utilService.mostrarMensagemFormularioInvalido();
        return;
      }
  
      this.achadoperdidoService.salvar(this.achadoperdido).subscribe(() => {
        this.achadoperdidoService.mostrarMensagemSucesso();
  
        this.voltar();
      });
    }
  
    limpar(): void {
      this.achadoperdido = new Achadoperdido();
    }
  
    voltar(): void {
      this.router.navigate(["/achadosperdidos"]);
    }
}
