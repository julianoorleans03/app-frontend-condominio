import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from '../event-utils';
import { Reserva } from '../model/reserva.model';
import { ReservaService } from '../service/reserva.service';
import * as moment from "moment";
import { UtilService } from '../service/util.service';
import { ModalReservaComponent } from './modal-reserva/modal-reserva.component';

declare const jQuery: any;

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {


  @ViewChild(ModalReservaComponent, { static: false })
  modalReservaReference: ModalReservaComponent;

  resetarComponenteModalConsulta: boolean;

  reserva: Reserva;
  calendarApi: any;
  selectInfo: any;
  reservas: Array<Reserva>;

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: "pt",
    initialEvents: this.buscar.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(private reservaService: ReservaService, public utilService: UtilService) {

  }

  async buscar(): Promise<EventInput[]> {
    let INITIAL_EVENTS: EventInput[] = [];

    await this.reservaService.buscar().then(response => {
      this.reservas = response;
      response.forEach(item => {
        if (item.status != 'cancelada') {
          INITIAL_EVENTS.push({
            id: item._id,
            title: item.titulo + ' - ' + item.status,
            start: item.dataInicio,
            end: item.dataFim,
            allDay: false
          });
        }
      })
    });
    return INITIAL_EVENTS;
  }

  async ngOnInit(): Promise<void> {
    this.reserva = new Reserva()
  }

  salvar(item): void {
    this.reservaService.salvar(item).subscribe(() => {
      this.reservaService.mostrarMensagemSucesso();
    });
  }

  editar(item): void {
    this.reservaService.editar(item).subscribe(() => {
      this.reservaService.mostrarMensagemSucesso();
    });
  }

  handleDateSelect(selectInfoParameter: DateSelectArg) {
    this.selectInfo = selectInfoParameter;
    this.calendarApi = this.selectInfo.view.calendar;
    this.calendarApi.unselect();

    if (moment(this.selectInfo.startStr) < (moment(moment().format("YYYY-MM-DD")))) {
      this.utilService.mostrarMensagemAlerta("Não é possível selecionar uma data menor que a data atual.")
      return;
    }

    this.abrirModal();
  }

  abrirModal(evento: any = null): void {

    if (evento) {
      this.modalReservaReference.reserva = this.reservas.find(reserva => { return reserva.dataFim == moment(evento.startStr).format("YYYY-MM-DD") && reserva.dataFim == moment(evento.startStr).format("YYYY-MM-DD") && reserva.status != 'cancelada'}) || new Reserva();
    } else {
      this.modalReservaReference.reserva = this.reservas.find(reserva => { return reserva.dataFim == moment(this.selectInfo.startStr).format("YYYY-MM-DD") && reserva.dataFim == moment(this.selectInfo.startStr).format("YYYY-MM-DD") && reserva.status != 'cancelada'}) || new Reserva();
    }

    jQuery("#modal-reserva").modal().show();
  }

  recebeReserva(objetoRecebido): void {

    this.resetarComponenteModalConsulta = true;

    if (objetoRecebido?.reserva) {

      if (!objetoRecebido.reserva._id) {
        this.reserva = new Reserva();
        this.reserva.salao = "5f989caca57d7d07d830452d";
        this.reserva.dataInicio = moment(this.selectInfo.startStr).format("YYYY-MM-DD");
        this.reserva.dataFim = moment(this.selectInfo.startStr).format("YYYY-MM-DD");
        this.reserva.titulo = objetoRecebido.reserva.titulo || "Não Identificado";

        this.salvar(this.reserva);

        this.calendarApi.addEvent({
          id: createEventId(),
          title: "pendente-" + this.reserva.titulo,
          start: this.reserva.dataInicio,
          end: this.reserva.dataFim,
          allDay: this.selectInfo.allDay
        });
      } else {
        this.reserva = objetoRecebido.reserva;
        this.editar(this.reserva);
      }
    }

    setTimeout(() => {
      jQuery("#modal-reserva").modal().hide();
      jQuery("body").removeClass("modal-open");
      jQuery(".modal-backdrop").remove();

      this.resetarComponenteModalConsulta = false;
      window.location.reload();
    }, 100);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.abrirModal(clickInfo.event);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
