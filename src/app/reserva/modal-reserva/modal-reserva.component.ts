import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Reserva } from 'src/app/model/reserva.model';
import { AuthService } from 'src/app/service/auth.service';
import { ReservaService } from 'src/app/service/reserva.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.component.html',
  styleUrls: ['./modal-reserva.component.scss']
})
export class ModalReservaComponent implements OnInit {
  reserva: Reserva = new Reserva();

  salvando: boolean;

  @Output() enviarEntidadeCargoEmitter = new EventEmitter();

  @ViewChild("form") form;
  constructor(public utilService: UtilService, public authService: AuthService, private reservaService: ReservaService) { }

  ngOnInit(): void {

  }

  salvar(): void {
    this.salvando = true;

    if (this.form.invalid) {
      this.utilService.mostrarMensagemFormularioInvalido();
      return;
    }

    this.enviarEntidadeCargoEmitter.emit({
      reserva: this.reserva
    });
  }

  fecharModal(): void {
    this.enviarEntidadeCargoEmitter.emit(null);
  }

  reservaPendente(): boolean {
    return !(this.reserva.status == 'confirmada');
  }

  cancelar(): void {
    this.reservaService.cancelar(this.reserva).subscribe(() => {
      this.reservaService.mostrarMensagemSucesso();
    });;

    this.fecharModal();
  }
}
