import { Component, OnInit, ViewChild } from '@angular/core';
import { Reserva } from '../model/reserva.model';
import { ReservaService } from '../service/reserva.service';
import { UtilService } from '../service/util.service';
import { AuthService } from '../service/auth.service';
import * as moment from "moment";
import { Datasreserva } from '../model/datasreserva.model';
import { DatasreservaService } from '../service/datasreserva.service';
import { UsuarioService } from '../service/usuario.service';
import { async } from 'rxjs';
import { Usuario } from '../model/usuario.model';
import { Salao } from '../model/salao.model';
import { SalaoService } from '../service/salao.service';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {
  reserva: Reserva;
  reservas: Array<Reserva>;
  salvando: boolean;
  resetar: boolean;
  usuarios: Array<Usuario>;
  saloes: Array<Salao>;
  @ViewChild("form") form;
  constructor(private reservaService: ReservaService, public utilService: UtilService, public authService: AuthService, 
    private datasreservaService: DatasreservaService, private usuarioService: UsuarioService, private salaoService: SalaoService) {

  }

  async ngOnInit(): Promise<void> {
    this.reserva = new Reserva()
    await this.buscarReservas();

    await this.carregarUsuarioCorrente();
    await this.carregarSalao();
  }

  async carregarUsuarioCorrente(): Promise<void> {
    await this.usuarioService.buscar().then((response: Array<Usuario>) => {
      this.usuarios = response;
      this.reserva.usuario = this.usuarios.find((usuario: Usuario) => {return usuario._id == this.authService.retornaIdUsuarioLogin() });
      this.reserva.usuario = { id: this.reserva.usuario._id, nome: this.reserva.usuario.nome };
    });
  }

  async carregarSalao(): Promise<void> {
    await this.salaoService.buscar().then((response: Array<Salao>) => {
      this.saloes = response;
      this.reserva.salao = { id: this.saloes[0]._id, nome: this.saloes[0].nome };
    });
  }

  getNomeUsuario(reserva: Reserva): string {
    if (this.usuarios) {
      return this.usuarios.find(usuario => { return usuario._id == reserva.usuario }).nome;
    }
  }

  reservarMonstrarNaTabela(): Array<Reserva> {
    return this.reservas?.filter((reserva) => { return reserva.status != "cancelada" });
  }

  temReserva(): boolean {
    return this.reservarMonstrarNaTabela()?.length > 0;
  }

  async buscarReservas(): Promise<void> {
    this.reservas = new Array<Reserva>();

    await this.reservaService.buscar().then(response => {
      this.reservas = response;
    });
  }

  dataInicioEhMenorQueDataAtual(): boolean {
    let dataInicioFormatada = this.utilService.retornaDataFormatada(this.reserva.dataInicio, "YYYY/MM/DD");
    return moment(dataInicioFormatada).diff(new Date, 'days') < 0;
  }

  dataFimEhMenorQueDataInicio(): boolean {
    let dataInicioFormatada = this.utilService.retornaDataFormatada(this.reserva.dataInicio, "YYYY/MM/DD");
    let dataFimFormatada = this.utilService.retornaDataFormatada(this.reserva.dataFim, "YYYY/MM/DD");

    return moment(dataFimFormatada).diff(dataInicioFormatada, 'days') < 0;
  }

  async jaTemReservaParaDataEscolhida(datasreservaSalvando): Promise<boolean> {
    let datasreserva: Array<Datasreserva> = new Array<Datasreserva>();

    await this.datasreservaService.buscar().then(response => {
      datasreserva = response;
    });

    let datas: Array<any> = new Array<any>();
    datasreserva.forEach((datareserva) => {
      datareserva.datas.forEach(data => {
        datas.push(data);
      });
    });

    let jaTemReserva = false;
    datasreservaSalvando.datas.forEach(dataVerificar => {
      if (datas.filter((data: string) => { return data == dataVerificar }).length > 0) {
        if (!jaTemReserva) {
          jaTemReserva = true;
        }
      }
    })
    return jaTemReserva;
  }

  async reservar(): Promise<void> {

    this.resetar = false;
    this.salvando = true;

    if (this.form.invalid) {
      this.utilService.mostrarMensagemFormularioInvalido();
      return;
    }

    if (this.dataInicioEhMenorQueDataAtual()) {
      this.utilService.mostrarMensagemAlerta("A data início deve ser maior ou igual a data atual.");
      return;
    }

    if (this.dataFimEhMenorQueDataInicio()) {
      this.utilService.mostrarMensagemAlerta("A data fim deve ser maior ou igual a data início.");
      return;
    }

    let datasreservaSalvando = this.retornarPeriodoReserva();

    if (await this.jaTemReservaParaDataEscolhida(datasreservaSalvando)) {
      this.utilService.mostrarMensagemAlerta("Já tem uma reserva pra essa data. Selecione outra data.");
      return;
    }

    this.reserva.dataInicio = this.utilService.retornaDataFormatada(this.reserva.dataInicio);
    this.reserva.dataFim = this.utilService.retornaDataFormatada(this.reserva.dataFim);
    this.reserva.salao = this.reserva.salao.id;
    this.reserva.usuario = this.reserva.usuario.id;
    this.reservaService.salvar(this.reserva).subscribe((response) => {
      this.utilService.mostrarMensagemSucesso("Reserva salva com sucesso!");
      datasreservaSalvando.reserva = response.data._id
      this.salvarDatasDaReserva(datasreservaSalvando);
      this.resetar = true;
      this.reserva = new Reserva();
      this.buscarReservas();
      this.carregarUsuarioCorrente();
      this.carregarSalao();
    });
  }

  salvarDatasDaReserva(datas): void {
    this.datasreservaService.salvar(datas).subscribe(() => {
    });
  }

  retornarPeriodoReserva(): Datasreserva {
    let datasreserva = new Datasreserva();
    datasreserva.datas.push(this.utilService.retornaDataFormatada(this.reserva.dataInicio));

    let dataInicioFormatada = this.utilService.retornaDataFormatada(this.reserva.dataInicio, "YYYY/MM/DD");
    let dataFimFormatada = this.utilService.retornaDataFormatada(this.reserva.dataFim, "YYYY/MM/DD");

    let diferencaDeDias = moment(dataFimFormatada).diff(dataInicioFormatada, 'days');

    for (let i = 1; i < diferencaDeDias; i++) {
      datasreserva.datas.push(moment(dataInicioFormatada).add(i, 'days').format('DD/MM/YYYY'));
    }

    if (diferencaDeDias > 0) {
      datasreserva.datas.push(this.utilService.retornaDataFormatada(this.reserva.dataFim));
    }

    return datasreserva;
  }

  confirmar(reserva: Reserva): void {
    this.reservaService.confirmar(reserva).subscribe(() => {
      this.utilService.mostrarMensagemSucesso("Reserva confirmada com sucesso!");
      this.buscarReservas();
    });
  }

  cancelar(reserva: Reserva): void {
    this.reservaService.cancelar(reserva).subscribe(() => {
      this.utilService.mostrarMensagemSucesso("Reserva cancelada com sucesso!");
      this.datasreservaService.deletar(reserva).subscribe(() => { });
      this.buscarReservas();
    });
  }
}
