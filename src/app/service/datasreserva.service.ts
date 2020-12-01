import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UtilService } from './util.service';
import { environment } from 'src/environments/environment';
import { Datasreserva } from '../model/datasreserva.model';

@Injectable({
  providedIn: "root"
})
export class DatasreservaService {
  constructor(public http: HttpClient, public utilService: UtilService) {
  }

  buscar(): Promise<Array<Datasreserva>> {
    return this.http
      .get<Array<Datasreserva>>(`${environment.api}/datasreserva/`)
      .toPromise();
  }

  salvar(item: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/datasreserva`, item);
  }

  deletar(item: any): Observable<any> {
    return this.http.delete<any>(
      `${environment.api}/datasreserva/${item._id}`
    );
  }
}
