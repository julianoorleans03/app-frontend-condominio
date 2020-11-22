import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from '../event-utils';
import { Reserva } from '../model/reserva.model';
import { ReservaService } from '../service/reserva.service';
import * as moment from "moment";

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {

  reserva: Reserva = new Reserva();

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
    /* you can update a remote database when these fire:
    
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  constructor(private reservaService: ReservaService) {

  }

  async buscar(): Promise<EventInput[]> {
    let INITIAL_EVENTS: EventInput[] = [];

    await this.reservaService.buscar().then(response => {
      response.forEach(item => {
        INITIAL_EVENTS.push({
          id: item._id,
          title: item.status,
          start: new Date(moment(item.dataInicio).utcOffset(0).toString()),
          end:  new Date(moment(item.dataFim).utcOffset(0).toString()),
          allDay: false
        })
      })
    });
    return INITIAL_EVENTS;

  }

  async ngOnInit(): Promise<void> {

  }

  salvar(item): void {
    this.reservaService.salvar(item).subscribe(() => {
      this.reservaService.mostrarMensagemSucesso();
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {

      this.reserva = new Reserva();
      this.reserva.salao = "5f989caca57d7d07d830452d";
      this.reserva.dataInicio = new Date(moment(selectInfo.startStr).utcOffset(0).toString());
      this.reserva.dataFim = new Date(moment(selectInfo.endStr).utcOffset(0).toString()) ;
  
      this.salvar(this.reserva);
      
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: this.reserva.dataInicio,
        end: this.reserva.dataFim,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }


}
