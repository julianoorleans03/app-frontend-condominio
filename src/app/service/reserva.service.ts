import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UtilService } from './util.service';
import { environment } from 'src/environments/environment';
import { Reserva } from '../model/reserva.model';

@Injectable({
  providedIn: "root"
})
export class ReservaService {
  constructor(public http: HttpClient, public utilService: UtilService) {
  }

  buscar(): Promise<Array<Reserva>> {
    return this.http
      .get<Array<Reserva>>(`${environment.api}/reserva/`)
      .toPromise();
  }

  confirmar(item: any): Observable<any> {
    return this.http.put<any>(
      `${environment.api}/reserva/confirmar/${item._id}`,
      {status: "confirmada"}
    );
  }

  cancelar(item: any): Observable<any> {
    return this.http.put<any>(
      `${environment.api}/achadoperdido/cancelar/${item._id}`,
      {status: "cancelada"}
    );
  }

  salvar(item: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/reserva`, item);
  }

  mostrarMensagemSucesso(): void {
    this.utilService.mostrarMensagemSucesso("Item Salvo com Sucesso.");
  }
}
